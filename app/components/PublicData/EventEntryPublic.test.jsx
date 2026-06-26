import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import EventEntryPublic from "./EventEntryPublic";

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

vi.mock("./StandingsTablePublic", () => ({
  default: ({ matchesData, registeredTeams }) => (
    <div data-testid="standings-table">
      standings:{matchesData.length}:{registeredTeams.length}
    </div>
  ),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("EventEntryPublic", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("expands and renders standings when match data exists", async () => {
    const user = userEvent.setup();

    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/events/4/teams") {
        return Promise.resolve({
          data: {
            data: [{ team_id: 12, player1name: "Ada", player2name: "Grace" }],
          },
        });
      }

      return Promise.resolve({
        data: {
          data: [{ match_id: 21, event_id: 4 }],
        },
      });
    });

    renderWithQueryClient(
      <EventEntryPublic
        event={{ event_id: 4, event_name: "Division A", midway_matches: 3 }}
        leagueID={1}
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/events/4/teams");
      expect(axios.get).toHaveBeenCalledWith("/api/events/4/matches");
    });

    await user.click(await screen.findByRole("button", { name: "Expand Teams" }));

    expect(await screen.findByTestId("standings-table")).toHaveTextContent(
      "standings:1:1"
    );
  });

  it("does not render standings when the event has no matches", async () => {
    const user = userEvent.setup();

    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/events/4/teams") {
        return Promise.resolve({
          data: {
            data: [{ team_id: 12, player1name: "Ada", player2name: "Grace" }],
          },
        });
      }

      return Promise.resolve({
        data: {
          data: [],
        },
      });
    });

    renderWithQueryClient(
      <EventEntryPublic
        event={{ event_id: 4, event_name: "Division A", midway_matches: 3 }}
        leagueID={1}
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    await user.click(await screen.findByRole("button", { name: "Expand Teams" }));

    expect(screen.queryByTestId("standings-table")).not.toBeInTheDocument();
  });

  it("keeps the loading state visible until team data resolves", async () => {
    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/events/4/teams") {
        return new Promise(() => {});
      }

      return Promise.resolve({
        data: {
          data: [],
        },
      });
    });

    renderWithQueryClient(
      <EventEntryPublic
        event={{ event_id: 4, event_name: "Division A", midway_matches: 3 }}
        leagueID={1}
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/events/4/teams");
      expect(axios.get).toHaveBeenCalledWith("/api/events/4/matches");
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("shows an error state when the team query fails", async () => {
    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/events/4/teams") {
        return Promise.reject(new Error("team request failed"));
      }

      return Promise.resolve({
        data: {
          data: [],
        },
      });
    });

    renderWithQueryClient(
      <EventEntryPublic
        event={{ event_id: 4, event_name: "Division A", midway_matches: 3 }}
        leagueID={1}
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    expect(
      await screen.findByText("There was an error, try again.")
    ).toBeInTheDocument();
  });
});
