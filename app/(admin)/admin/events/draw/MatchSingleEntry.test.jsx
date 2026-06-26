import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import MatchSingleEntry from "./MatchSingleEntry";

vi.mock("./MatchReportModal", () => ({
  default: ({ match }) => (
    <div data-testid="match-report-modal">report:{match.match_id}</div>
  ),
}));

describe("MatchSingleEntry", () => {
  const match = {
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

  it("opens the match report modal when the action button is clicked", async () => {
    const user = userEvent.setup();

    render(<MatchSingleEntry index={0} match={match} midway_point="2026-06-20" />);

    await user.click(screen.getByRole("button", { name: "Edit Match Details" }));

    expect(await screen.findByTestId("match-report-modal")).toHaveTextContent(
      "report:31"
    );
  });

  it("disables match report actions for withdrawn matches", () => {
    render(
      <MatchSingleEntry
        index={0}
        match={{ ...match, withdrawal: true }}
        midway_point="2026-06-20"
      />
    );

    expect(
      screen.getByRole("button", { name: "Edit Match Details" })
    ).toBeDisabled();
  });
});
