import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import PlayerSearch from "./PlayerSearch";

const { mockAxiosGet, mockAxiosPost } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
  mockAxiosPost: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
    post: mockAxiosPost,
  },
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("PlayerSearch", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
    mockAxiosPost.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers an event team using the normalized team_id payload", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    mockAxiosGet.mockResolvedValue({
      data: {
        data: [
          {
            team_id: 12,
            player1_firstname: "Ada",
            player1_lastname: "Lovelace",
            player2_firstname: "Grace",
            player2_lastname: "Hopper",
          },
        ],
      },
    });
    mockAxiosPost.mockResolvedValue({ data: { data: { event_id: 4, team_id: 12 } } });

    renderWithQueryClient(
      <PlayerSearch registeredTeams={[]} event={4} />,
      queryClient
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/teams");
    });

    await user.type(
      screen.getByPlaceholderText("Search by participant's name:"),
      "Ada"
    );
    await user.click(screen.getByRole("button", { name: "Submit search" }));
    await user.click(
      await screen.findByRole("button", {
        name: "Add team Ada Lovelace & Grace Hopper to event",
      })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith("/api/events/4/teams", {
      team_id: 12,
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "event-participants",
        4,
      ]);
    });
  });

  it("clears search results without submitting the form again", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    mockAxiosGet.mockResolvedValue({
      data: {
        data: [
          {
            team_id: 12,
            player1_firstname: "Ada",
            player1_lastname: "Lovelace",
            player2_firstname: "Grace",
            player2_lastname: "Hopper",
          },
        ],
      },
    });

    renderWithQueryClient(
      <PlayerSearch registeredTeams={[]} event={4} />,
      queryClient
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    await user.type(
      screen.getByPlaceholderText("Search by participant's name:"),
      "Ada"
    );
    await user.click(screen.getByRole("button", { name: "Submit search" }));
    expect(await screen.findByText("Search results:")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search results" }));

    expect(screen.getByPlaceholderText("Search by participant's name:")).toHaveValue("");
    expect(screen.queryByText("Search results:")).not.toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
