import {
  areTeamsInSameDivision,
  isSameDivisionChallengerMatch,
} from "./challengerRules";

describe("challengerRules", () => {
  it("detects when two teams belong to the same division", () => {
    expect(
      areTeamsInSameDivision({ event_id: 3 }, { event_id: "3" })
    ).toBe(true);
    expect(
      areTeamsInSameDivision({ event_id: 3 }, { event_id: 4 })
    ).toBe(false);
  });

  it("detects same-division challenger payloads", () => {
    expect(
      isSameDivisionChallengerMatch({
        team1_event_id: 8,
        team2_event_id: "8",
      })
    ).toBe(true);
    expect(
      isSameDivisionChallengerMatch({
        team1_event_id: 8,
        team2_event_id: 9,
      })
    ).toBe(false);
  });
});
