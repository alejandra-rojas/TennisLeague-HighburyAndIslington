import { afterEach, describe, expect, it } from "vitest";
import { useStore } from "./createStore";

afterEach(() => {
  useStore.setState({ drawParticipants: [], lastAction: null });
});

describe("useStore", () => {
  it("adds a new team and records the action", () => {
    const team = { team_id: 1, name: "Team A" };

    useStore.getState().addTeam(team);

    expect(useStore.getState().drawParticipants).toEqual([team]);
    expect(useStore.getState().lastAction).toBe("added");
  });

  it("prevents duplicate teams and records the duplicate action", () => {
    const team = { team_id: 1, name: "Team A" };

    useStore.getState().addTeam(team);
    useStore.getState().addTeam(team);

    expect(useStore.getState().drawParticipants).toEqual([team]);
    expect(useStore.getState().lastAction).toBe("duplicate");
  });

  it("removes teams and can reset the last action", () => {
    const team = { team_id: 1, name: "Team A" };

    useStore.getState().addTeam(team);
    useStore.getState().removeTeam(team.team_id);
    useStore.getState().resetLastAction();

    expect(useStore.getState().drawParticipants).toEqual([]);
    expect(useStore.getState().lastAction).toBeNull();
  });
});
