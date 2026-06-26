import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import LatestResults from "./LatestResults";

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

vi.mock("./LeagueCardPublic", () => ({
  default: ({ league_name }) => <div data-testid="league-card">{league_name}</div>,
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

describe("LatestResults", () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders only active leagues sorted by starting date", async () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().slice(0, 10);
    const daysFromToday = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return formatDate(date);
    };

    mockAxiosGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            league_name: "Later League",
            starting_date: daysFromToday(1),
            midway_point: daysFromToday(10),
            end_date: daysFromToday(20),
            isfinished: false,
          },
          {
            id: 2,
            league_name: "Current League",
            starting_date: daysFromToday(-2),
            midway_point: daysFromToday(5),
            end_date: daysFromToday(14),
            isfinished: false,
          },
          {
            id: 3,
            league_name: "Expired League",
            starting_date: daysFromToday(-60),
            midway_point: daysFromToday(-50),
            end_date: daysFromToday(-40),
            isfinished: true,
          },
          {
            id: 4,
            league_name: "Too Early League",
            starting_date: daysFromToday(10),
            midway_point: daysFromToday(20),
            end_date: daysFromToday(30),
            isfinished: false,
          },
        ],
      },
    });

    renderWithQueryClient(<LatestResults />);

    const cards = await screen.findAllByTestId("league-card");

    expect(cards).toHaveLength(2);
    expect(cards.map((card) => card.textContent)).toEqual([
      "Current League",
      "Later League",
    ]);
  });

  it("shows the empty state when there are no active leagues", async () => {
    const today = new Date();
    const expiredStart = new Date(today);
    expiredStart.setDate(expiredStart.getDate() - 60);
    const expiredMid = new Date(today);
    expiredMid.setDate(expiredMid.getDate() - 50);
    const expiredEnd = new Date(today);
    expiredEnd.setDate(expiredEnd.getDate() - 40);

    mockAxiosGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 3,
            league_name: "Expired League",
            starting_date: expiredStart.toISOString().slice(0, 10),
            midway_point: expiredMid.toISOString().slice(0, 10),
            end_date: expiredEnd.toISOString().slice(0, 10),
            isfinished: true,
          },
        ],
      },
    });

    renderWithQueryClient(<LatestResults />);

    expect(await screen.findByText("No active leagues currently.")).toBeInTheDocument();
  });

  it("shows an error state when the leagues query fails", async () => {
    mockAxiosGet.mockRejectedValue(new Error("Fetch failed"));

    renderWithQueryClient(<LatestResults />);

    expect(
      await screen.findByText("There was an error, try again.")
    ).toBeInTheDocument();
  });
});
