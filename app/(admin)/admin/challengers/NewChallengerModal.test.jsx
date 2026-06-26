import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import NewChallengerModal from "./NewChallengerModal";

const { mockAxiosPost } = vi.hoisted(() => ({
  mockAxiosPost: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    post: mockAxiosPost,
  },
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("NewChallengerModal", () => {
  const selectedTeams = [
    {
      team_id: 1,
      event_id: 5,
      player1_firstname: "Ada",
      player1_lastname: "Lovelace",
      player2_firstname: "Grace",
      player2_lastname: "Hopper",
    },
    {
      team_id: 2,
      event_id: 6,
      player1_firstname: "Alan",
      player1_lastname: "Turing",
      player2_firstname: "Joan",
      player2_lastname: "Clarke",
    },
  ];

  beforeEach(() => {
    mockAxiosPost.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits a challenger match with a direct payload and null winner_id when unfinished", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const setShowChallengerModal = vi.fn();

    mockAxiosPost.mockResolvedValue({ data: { data: { match_id: 9 } } });

    renderWithQueryClient(
      <NewChallengerModal
        selectedTeams={selectedTeams}
        leagueID={3}
        setShowChallengerModal={setShowChallengerModal}
      />,
      queryClient
    );

    await user.type(screen.getByLabelText("Date of the match:"), "2026-06-20");
    await user.type(screen.getByLabelText("Winner score:"), "6/4 6/4");
    await user.type(screen.getByLabelText("T1 bonus points:"), "1");
    await user.type(screen.getByLabelText("T2 bonus points:"), "3");
    await user.click(screen.getByRole("button", { name: "Update Match data" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith("/api/leagues/3/challengers", {
      team1_id: 1,
      team1_event_id: 5,
      team2_id: 2,
      team2_event_id: 6,
      isfinished: false,
      match_date: "2026-06-20",
      winner_id: null,
      winner_score: "6/4 6/4",
      team1_bonus: 1,
      team2_bonus: 3,
    });

    await waitFor(() => {
      expect(setShowChallengerModal).toHaveBeenCalledWith(false);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["league-challengers", 3],
      });
    });
  });
});
