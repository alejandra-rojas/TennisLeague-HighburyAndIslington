import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import ChallengerEditModal from "./ChallengerEditModal";

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

describe("ChallengerEditModal", () => {
  const match = {
    match_id: 11,
    league_id: 4,
    team1_id: 1,
    team2_id: 2,
    match_date: "2026-06-18",
    isfinished: false,
    winner_id: null,
    winner_score: "",
    team1_bonus: null,
    team2_bonus: null,
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

  it("submits an edited challenger match with a direct payload", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const setShowReportModal = vi.fn();

    mockAxiosPut.mockResolvedValue({ data: { data: { match_id: 11 } } });

    renderWithQueryClient(
      <ChallengerEditModal
        match={match}
        setShowReportModal={setShowReportModal}
      />,
      queryClient
    );

    await user.click(screen.getByLabelText("Match completed?"));
    await user.selectOptions(screen.getByLabelText("Who won?"), "2");
    await user.type(screen.getByLabelText("Winner score:"), "6/2 6/3");
    await user.type(screen.getByLabelText(/Ada & Grace bonus:/), "1");
    await user.type(screen.getByLabelText(/Alan & Joan bonus :/), "3");
    await user.click(screen.getByRole("button", { name: "Update Match data" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    expect(axios.put).toHaveBeenCalledWith("/api/challengers/11", {
      team1_id: 1,
      team2_id: 2,
      isfinished: true,
      match_date: "2026-06-18",
      winner_id: 2,
      winner_score: "6/2 6/3",
      team1_bonus: 1,
      team2_bonus: 3,
    });

    await waitFor(() => {
      expect(setShowReportModal).toHaveBeenCalledWith(false);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["league-challengers", 4],
      });
    });
  });
});
