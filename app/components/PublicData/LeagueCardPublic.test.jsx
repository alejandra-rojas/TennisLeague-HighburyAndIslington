import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import LeagueCardPublic from "./LeagueCardPublic";

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

vi.mock("./EventsPublic", () => ({
  default: ({ challengerMatches, leagueID, league_name }) => (
    <div data-testid="events-public">
      events:{leagueID}:{league_name}:{challengerMatches.length}
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

describe("LeagueCardPublic", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the league card and passes challenger matches to public events", async () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().slice(0, 10);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 20);
    const midwayPoint = new Date(today);
    midwayPoint.setDate(midwayPoint.getDate() - 10);

    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/leagues/4/challengers") {
        return Promise.resolve({
          data: {
            data: [{ match_id: 21 }, { match_id: 22 }],
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
      <LeagueCardPublic
        id={4}
        league_name="Summer League"
        starting_date={formatDate(startDate)}
        midway_point={formatDate(midwayPoint)}
        end_date={formatDate(today)}
        isfinished={false}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/leagues/4/challengers");
    });

    expect(await screen.findByText("Summer League")).toBeInTheDocument();
    expect(
      screen.getByText("Today is the last day to complete a match")
    ).toBeInTheDocument();
    expect(await screen.findByTestId("events-public")).toHaveTextContent(
      "events:4:Summer League:2"
    );
  });

  it("shows a loading state while challenger data is still loading", async () => {
    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/leagues/4/challengers") {
        return new Promise(() => {});
      }

      return Promise.resolve({
        data: {
          data: [],
        },
      });
    });

    renderWithQueryClient(
      <LeagueCardPublic
        id={4}
        league_name="Summer League"
        starting_date="2026-06-01"
        midway_point="2026-06-20"
        end_date="2026-07-20"
        isfinished={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Loading league data...")).toBeInTheDocument();
    });
  });

  it("shows an error state when the challenger query fails", async () => {
    mockAxiosGet.mockImplementation((url) => {
      if (url === "/api/leagues/4/challengers") {
        return Promise.reject(new Error("Fetch failed"));
      }

      return Promise.resolve({
        data: {
          data: [],
        },
      });
    });

    renderWithQueryClient(
      <LeagueCardPublic
        id={4}
        league_name="Summer League"
        starting_date="2026-06-01"
        midway_point="2026-06-20"
        end_date="2026-07-20"
        isfinished={false}
      />
    );

    expect(
      await screen.findByText("There was an error, try again.")
    ).toBeInTheDocument();
  });
});
