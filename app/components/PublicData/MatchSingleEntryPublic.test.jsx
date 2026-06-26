import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MatchSingleEntryPublic from "./MatchSingleEntryPublic";

describe("MatchSingleEntryPublic", () => {
  const baseMatch = {
    match_id: 31,
    team1_id: 1,
    team2_id: 2,
    winner_id: 1,
    winner_score: "6/4 6/4",
    match_date: "2026-06-20",
    isfinished: true,
    withdrawal: false,
    team1: {
      player1: { firstname: "Ada" },
      player2: { firstname: "Grace" },
    },
    team2: {
      player1: { firstname: "Alan" },
      player2: { firstname: "Joan" },
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a finished pre-midpoint match with a midpoint marker and visible score", () => {
    const { container } = render(
      <MatchSingleEntryPublic
        index={0}
        match={baseMatch}
        midway_point="2026-06-25"
      />
    );

    expect(screen.getByText("Ada & Grace")).toBeInTheDocument();
    expect(screen.getByText("Alan & Joan")).toBeInTheDocument();
    expect(screen.getByText("6/4 6/4")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(container.querySelector(".font-bold")).toHaveTextContent(
      "Ada & Grace"
    );
  });

  it("renders an unfinished scheduled match with the unfinished marker and no midpoint flag after the midpoint", () => {
    render(
      <MatchSingleEntryPublic
        index={1}
        match={{
          ...baseMatch,
          winner_id: null,
          winner_score: "1",
          isfinished: false,
          match_date: "2026-06-30",
        }}
        midway_point="2026-06-25"
      />
    );

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
