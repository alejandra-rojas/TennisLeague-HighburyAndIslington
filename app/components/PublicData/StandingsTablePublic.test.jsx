import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StandingsTablePublic from "./StandingsTablePublic";

vi.mock("next/font/google", () => ({
  Barlow_Condensed: () => ({ variable: "font-barlow" }),
  Roboto_Condensed: () => ({ variable: "font-barlow-semi" }),
  Barlow_Semi_Condensed: () => ({ variable: "unused" }),
  Sofia_Sans_Semi_Condensed: () => ({ variable: "unused" }),
  Sofia_Sans_Condensed: () => ({ variable: "unused" }),
}));

vi.mock("./MatchesReportsPublic", () => ({
  default: ({ matchesData }) => (
    <div data-testid="matches-reports">reports:{matchesData.length}</div>
  ),
}));

vi.mock("./ChallengerMatchesPublic", () => ({
  default: ({ challengerMatches }) => (
    <div data-testid="challenger-reports">
      challengers:{challengerMatches.length}
    </div>
  ),
}));

describe("StandingsTablePublic", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sorts teams by computed totals and shows bonus summaries", () => {
    render(
      <StandingsTablePublic
        registeredTeams={[
          {
            team_id: 1,
            player1name: "Ada Lovelace",
            player2name: "Grace Hopper",
            team_withdrawn: false,
            challenger_bonus: 0,
            total_points: 0,
          },
          {
            team_id: 2,
            player1name: "Alan Turing",
            player2name: "Joan Clarke",
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
            match_date: "2026-06-10",
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

    expect(within(rows[1]).getByText("Ada L & Grace H")).toBeInTheDocument();
    expect(within(rows[1]).getByText("1/1")).toBeInTheDocument();
    expect(within(rows[1]).getByText("6")).toBeInTheDocument();

    expect(within(rows[2]).getByText("Alan T & Joan C")).toBeInTheDocument();
    expect(within(rows[2]).getByText("1/1")).toBeInTheDocument();
    expect(within(rows[2]).getAllByText("5")).toHaveLength(2);
  });

  it("toggles the individual match details section", async () => {
    const user = userEvent.setup();

    render(
      <StandingsTablePublic
        registeredTeams={[
          {
            team_id: 1,
            player1name: "Ada Lovelace",
            player2name: "Grace Hopper",
            team_withdrawn: false,
            challenger_bonus: 0,
            total_points: 0,
          },
          {
            team_id: 2,
            player1name: "Alan Turing",
            player2name: "Joan Clarke",
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
            match_date: "2026-06-10",
          },
        ]}
        challengerMatches={[{ match_id: 91 }]}
        midway_point="2026-06-20"
        midmatches_needed={1}
      />
    );

    const toggle = screen.getByRole("button", {
      name: "view individual match results",
    });

    await user.click(toggle);

    expect(screen.getByTestId("matches-reports")).toHaveTextContent("reports:1");
    expect(screen.getByTestId("challenger-reports")).toHaveTextContent(
      "challengers:1"
    );

    await user.click(
      screen.getByRole("button", { name: "close individual match results" })
    );

    expect(screen.queryByTestId("matches-reports")).not.toBeInTheDocument();
    expect(screen.queryByTestId("challenger-reports")).not.toBeInTheDocument();
  });
});
