import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import MatchReportModal from "./MatchReportModal";

const { mockAxiosPut } = vi.hoisted(() => ({
  mockAxiosPut: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    put: mockAxiosPut,
  },
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("MatchReportModal", () => {
  const match = {
    match_id: 15,
    event_id: 44,
    team1_id: 1,
    team2_id: 2,
    match_date: "2026-06-01",
    bymidpoint: true,
    isfinished: false,
    winner_id: null,
    team1_sets: "",
    team2_sets: "",
    winner_score: "",
    team1: {
      player1: { firstname: "Ada", lastname: "Lovelace" },
      player2: { firstname: "Grace", lastname: "Hopper" },
    },
    team2: {
      player1: { firstname: "Alan", lastname: "Turing" },
      player2: { firstname: "Joan", lastname: "Clarke" },
    },
  };

  beforeEach(() => {
    mockAxiosPut.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows and hides the winner selector as the finished state changes", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    renderWithQueryClient(
      <MatchReportModal
        match={match}
        midway_point="2026-06-15"
        setShowMatchReportModal={vi.fn()}
      />,
      queryClient
    );

    expect(screen.queryByLabelText("Who won:")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Match completed?"));
    expect(screen.getByLabelText("Who won:")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Match completed?"));
    expect(screen.queryByLabelText("Who won:")).not.toBeInTheDocument();
  });

  it("submits the updated match report and recalculates byMidpoint", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const setShowMatchReportModal = vi.fn();

    mockAxiosPut.mockResolvedValue({ data: {} });

    renderWithQueryClient(
      <MatchReportModal
        match={match}
        midway_point="2026-06-15"
        setShowMatchReportModal={setShowMatchReportModal}
      />,
      queryClient
    );

    await user.clear(screen.getByLabelText("Date of the match:"));
    await user.type(screen.getByLabelText("Date of the match:"), "2026-06-20");
    await user.click(screen.getByLabelText("Match completed?"));
    await user.selectOptions(screen.getByLabelText("Who won:"), "2");
    await user.type(screen.getByLabelText("Winner score:"), "6/4 6/4");
    await user.type(
      screen.getByLabelText("Sets won by Ada & Grace:"),
      "0"
    );
    await user.type(
      screen.getByLabelText("Sets won by Alan & Joan:"),
      "2"
    );
    await user.click(screen.getByRole("button", { name: "Update Match data" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    expect(axios.put).toHaveBeenCalledWith("/api/matches/15", {
      match: expect.objectContaining({
        match_date: "2026-06-20",
        byMidpoint: false,
        isfinished: true,
        winner_id: "2",
        team1_sets: "0",
        team2_sets: "2",
        winner_score: "6/4 6/4",
      }),
    });

    await waitFor(() => {
      expect(setShowMatchReportModal).toHaveBeenCalledWith(false);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["event-draw", 44]);
    });
  });

  it("keeps the modal open when the update fails", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const setShowMatchReportModal = vi.fn();

    mockAxiosPut.mockRejectedValue(new Error("Update failed"));

    renderWithQueryClient(
      <MatchReportModal
        match={{ ...match, isfinished: true }}
        midway_point="2026-06-15"
        setShowMatchReportModal={setShowMatchReportModal}
      />,
      queryClient
    );

    await user.click(screen.getByRole("button", { name: "Update Match data" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Match data" })
      ).toHaveTextContent("Submit match report");
    });

    expect(setShowMatchReportModal).not.toHaveBeenCalledWith(false);
  });
});
