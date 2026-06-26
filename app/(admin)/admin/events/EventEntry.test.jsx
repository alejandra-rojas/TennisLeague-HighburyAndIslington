import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import EventEntry from "./EventEntry";

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

vi.mock("./EventModal", () => ({
  default: ({ event_id }) => <div data-testid="event-modal">edit:{event_id}</div>,
}));

vi.mock("./registration/EventRegistration", () => ({
  default: ({ event, registeredTeams }) => (
    <div data-testid="event-registration">
      registration:{event}:{registeredTeams.length}
    </div>
  ),
}));

vi.mock("./draw/StandingsTable", () => ({
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

describe("EventEntry", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the edit modal without expanding the event details", async () => {
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
      <EventEntry
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

    await user.click(
      screen.getByRole("button", { name: "Open modal to edit this event" })
    );

    expect(await screen.findByTestId("event-modal")).toHaveTextContent("edit:4");
    expect(screen.queryByTestId("event-registration")).not.toBeInTheDocument();
    expect(screen.queryByTestId("standings-table")).not.toBeInTheDocument();
  });

  it("expands from the keyboard and renders registration when there are no matches", async () => {
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
      <EventEntry
        event={{ event_id: 4, event_name: "Division A", midway_matches: 3 }}
        leagueID={1}
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    const header = await screen.findByRole("button", { name: "Expand Teams" });
    fireEvent.keyDown(header, { key: "Enter" });

    expect(await screen.findByTestId("event-registration")).toHaveTextContent(
      "registration:4:1"
    );
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
      <EventEntry
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

  it("shows an error state when team data fails to load", async () => {
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
      <EventEntry
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
