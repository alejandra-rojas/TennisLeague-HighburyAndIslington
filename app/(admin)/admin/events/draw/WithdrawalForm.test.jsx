import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import WithdrawalForm from "./WithdrawalForm";

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

describe("WithdrawalForm", () => {
  beforeEach(() => {
    mockAxiosPut.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits a withdrawal for an active team and invalidates related queries", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    mockAxiosPut.mockResolvedValue({
      data: { data: { eventTeams: [{ team_id: 12, team_withdrawn: true }] } },
    });

    renderWithQueryClient(
      <WithdrawalForm
        registeredTeams={[
          {
            event_id: 4,
            team_id: 12,
            player1name: "Ada Lovelace",
            player2name: "Grace Hopper",
            team_withdrawn: false,
          },
          {
            event_id: 4,
            team_id: 13,
            player1name: "Alan Turing",
            player2name: "Joan Clarke",
            team_withdrawn: true,
          },
        ]}
      />,
      queryClient
    );

    expect(screen.getByRole("option", { name: "Ada Lovelace & Grace Hopper" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Alan Turing & Joan Clarke" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Report Withdrawal" })
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("Select the player who has withdrawn"),
      "12"
    );

    await user.click(screen.getByRole("button", { name: "Report Withdrawal" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    expect(axios.put).toHaveBeenCalledWith("/api/events/4/teams/12");

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["event-draw", 4]);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "event-participants",
        4,
      ]);
    });
  });

  it("renders safely when no teams are available", () => {
    const queryClient = new QueryClient();

    renderWithQueryClient(<WithdrawalForm registeredTeams={[]} />, queryClient);

    expect(
      screen.queryByRole("heading", { name: "Withdraw team from event" })
    ).not.toBeInTheDocument();
  });

  it("shows the withdrawing state and keeps the selected team after a failed withdrawal", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    let rejectRequest;
    mockAxiosPut.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );

    renderWithQueryClient(
      <WithdrawalForm
        registeredTeams={[
          {
            event_id: 4,
            team_id: 12,
            player1name: "Ada Lovelace",
            player2name: "Grace Hopper",
            team_withdrawn: false,
          },
        ]}
      />,
      queryClient
    );

    await user.selectOptions(
      screen.getByLabelText("Select the player who has withdrawn"),
      "12"
    );

    const submitButton = screen.getByRole("button", {
      name: "Report Withdrawal",
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(submitButton).toHaveTextContent("Withdrawing...");
      expect(submitButton).toBeDisabled();
    });

    rejectRequest(new Error("Withdraw failed"));

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Complete withdrawal");
      expect(submitButton).not.toBeDisabled();
      expect(
        screen.getByLabelText("Select the player who has withdrawn")
      ).toHaveValue("12");
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
