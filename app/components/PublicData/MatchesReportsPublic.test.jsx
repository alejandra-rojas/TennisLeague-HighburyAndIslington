import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MatchesReportsPublic from "./MatchesReportsPublic";

vi.mock("./MatchSingleEntryPublic", () => ({
  default: ({ match }) => (
    <li data-testid="match-row">
      {match.match_id}:{match.match_date}:{match.isfinished ? "F" : match.withdrawal ? "W" : "U"}
    </li>
  ),
}));

describe("MatchesReportsPublic", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("filters out undated matches and sorts finished, unfinished, and withdrawn results", () => {
    render(
      <MatchesReportsPublic
        matchesData={[
          {
            match_id: 1,
            match_date: "2026-06-15",
            isfinished: false,
            withdrawal: false,
          },
          {
            match_id: 2,
            match_date: "2026-06-20",
            isfinished: true,
            withdrawal: false,
          },
          {
            match_id: 3,
            match_date: "2026-06-10",
            isfinished: false,
            withdrawal: true,
          },
          {
            match_id: 4,
            match_date: null,
            isfinished: true,
            withdrawal: false,
          },
        ]}
        midway_point="2026-06-20"
      />
    );

    expect(screen.getAllByTestId("match-row").map((row) => row.textContent)).toEqual([
      "2:2026-06-20:F",
      "1:2026-06-15:U",
      "3:2026-06-10:W",
    ]);
  });
});
