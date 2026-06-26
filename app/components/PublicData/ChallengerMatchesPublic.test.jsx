import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ChallengerMatchesPublic from "./ChallengerMatchesPublic";

describe("ChallengerMatchesPublic", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders only challenger matches involving registered teams", () => {
    render(
      <ChallengerMatchesPublic
        registeredTeams={[{ team_id: 1 }, { team_id: 3 }]}
        challengerMatches={[
          {
            match_id: 11,
            team1_id: 1,
            team2_id: 9,
            winner_id: 1,
            winner_score: "6/4 6/4",
            isfinished: true,
            match_date: "2026-06-20",
            team1_bonus: 1,
            team2_bonus: 0,
            team1: {
              player1: { firstname: "Ada" },
              player2: { firstname: "Grace" },
            },
            team2: {
              player1: { firstname: "Alan" },
              player2: { firstname: "Joan" },
            },
          },
          {
            match_id: 12,
            team1_id: 8,
            team2_id: 9,
            winner_id: 8,
            winner_score: "6/0 6/0",
            isfinished: true,
            match_date: "2026-06-21",
            team1_bonus: 2,
            team2_bonus: 0,
            team1: {
              player1: { firstname: "Unused" },
              player2: { firstname: "Pair" },
            },
            team2: {
              player1: { firstname: "Other" },
              player2: { firstname: "Team" },
            },
          },
        ]}
      />
    );

    expect(screen.getByText("Ada & Grace")).toBeInTheDocument();
    expect(screen.getByText("Alan & Joan")).toBeInTheDocument();
    expect(screen.queryByText("Unused & Pair")).not.toBeInTheDocument();
    expect(screen.queryByText("Other & Team")).not.toBeInTheDocument();
    expect(screen.getByText("6/4 6/4")).toBeInTheDocument();
  });

  it("renders nothing when there are no related challenger matches", () => {
    render(
      <ChallengerMatchesPublic
        registeredTeams={[{ team_id: 1 }]}
        challengerMatches={[
          {
            match_id: 12,
            team1_id: 8,
            team2_id: 9,
            winner_id: 8,
            winner_score: "6/0 6/0",
            isfinished: true,
            match_date: "2026-06-21",
            team1_bonus: 2,
            team2_bonus: 0,
            team1: {
              player1: { firstname: "Unused" },
              player2: { firstname: "Pair" },
            },
            team2: {
              player1: { firstname: "Other" },
              player2: { firstname: "Team" },
            },
          },
        ]}
      />
    );

    expect(screen.queryByText("CHALLENGER MATCHES")).not.toBeInTheDocument();
  });
});
