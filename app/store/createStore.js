import { create } from "zustand";

export const useStore = create((set, get) => ({
  drawParticipants: [],
  lastAction: null,
  addTeam: (newTeam) =>
    set((state) => {
      const isTeamPresent = state.drawParticipants.some(
        (team) => team.team_id === newTeam.team_id
      );
      if (isTeamPresent) {
        return { ...state, lastAction: "duplicate" };
      }

      return {
        drawParticipants: [...state.drawParticipants, newTeam],
        lastAction: "added",
      };
    }),
  removeTeam: (teamId) =>
    set((state) => ({
      drawParticipants: state.drawParticipants.filter(
        (team) => team.team_id !== teamId
      ),
    })),
  resetLastAction: () => set(() => ({ lastAction: null })),
}));
