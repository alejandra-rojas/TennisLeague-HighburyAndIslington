import { create } from "zustand";

export const useStore = create((set, get) => ({
  drawParticipants: [],
  addTeam: (newTeam) =>
    set((state) => {
      return { drawParticipants: [...state.drawParticipants, newTeam] };
    }),
  removeTeam: () => set({ count: 0 }),
}));
