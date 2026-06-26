import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import StandingsTable from "./StandingsTable";

vi.mock("./MatchesReports", () => ({
  default: () => <div data-testid="match-reports">reports</div>,
}));

vi.mock("./WithdrawalForm", () => ({
  default: () => <div data-testid="withdrawal-form">withdrawal</div>,
}));

vi.mock("../../challengers/event_entries/ChallengerMatchesReports", () => ({
  default: () => <div data-testid="challenger-reports">challengers</div>,
}));

describe("StandingsTable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sorts teams by computed total points including midpoint, all-played, and challenger bonuses", () => {
    render(
      <StandingsTable
        registeredTeams={[
          {
            team_id: 1,
            player1name: "Ada",
            player2name: "Grace",
            team_withdrawn: false,
            challenger_bonus: 0,
            total_points: 0,
          },
          {
            team_id: 2,
            player1name: "Alan",
            player2name: "Joan",
            team_withdrawn: false,
            challenger_bonus: 0,
            total_points: 0,
          },
        ]}
        matchesData={[
          {
            match_id: 21,
            team1_id: 1,
            team2_id: 2,
            isfinished: true,
            bymidpoint: true,
            withdrawal: false,
            winner_id: 1,
            team1_sets: 2,
            team2_sets: 0,
          },
        ]}
        challengerMatches={[
          {
            team1_id: 9,
            team2_id: 2,
            team1_bonus: 0,
            team2_bonus: 3,
          },
        ]}
        midway_point="2026-06-20"
        midmatches_needed={1}
      />
    );

    const rows = screen.getAllByRole("listitem");

    expect(within(rows[1]).getByText("Ada & Grace")).toBeInTheDocument();
    expect(within(rows[1]).getByText("1/1")).toBeInTheDocument();
    expect(within(rows[1]).getByText("6")).toBeInTheDocument();

    expect(within(rows[2]).getByText("Alan & Joan")).toBeInTheDocument();
    expect(within(rows[2]).getByText("1/1")).toBeInTheDocument();
    expect(within(rows[2]).getByText("5")).toBeInTheDocument();

    expect(screen.getByTestId("match-reports")).toBeInTheDocument();
    expect(screen.getByTestId("challenger-reports")).toBeInTheDocument();
    expect(screen.getByTestId("withdrawal-form")).toBeInTheDocument();
  });
});
