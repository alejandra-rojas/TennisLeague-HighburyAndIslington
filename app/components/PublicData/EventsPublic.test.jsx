import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import EventsPublic from "./EventsPublic";

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

vi.mock("./EventEntryPublic", () => ({
  default: ({ event }) => <div data-testid="event-entry">{event.event_name}</div>,
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

describe("EventsPublic", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sorts public events alphabetically before rendering", async () => {
    mockAxiosGet.mockResolvedValue({
      data: {
        data: [
          { event_id: 2, event_name: "Division B", midway_matches: 2 },
          { event_id: 1, event_name: "Division A", midway_matches: 3 },
        ],
      },
    });

    renderWithQueryClient(
      <EventsPublic
        leagueID={4}
        hasStarted={true}
        league_name="Summer League"
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    const entries = await screen.findAllByTestId("event-entry");

    expect(entries.map((entry) => entry.textContent)).toEqual([
      "Division A",
      "Division B",
    ]);
  });

  it("shows an error state when the events query fails", async () => {
    mockAxiosGet.mockRejectedValue(new Error("Fetch failed"));

    renderWithQueryClient(
      <EventsPublic
        leagueID={4}
        hasStarted={true}
        league_name="Summer League"
        challengerMatches={[]}
        midway_point="2026-06-20"
      />
    );

    expect(
      await screen.findByText("There was an error, try again.")
    ).toBeInTheDocument();
  });
});
