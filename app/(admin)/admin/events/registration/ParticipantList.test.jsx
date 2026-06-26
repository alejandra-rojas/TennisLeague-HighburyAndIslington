import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import ParticipantList from "./ParticipantList";

const { mockAxiosDelete } = vi.hoisted(() => ({
  mockAxiosDelete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    delete: mockAxiosDelete,
  },
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ParticipantList", () => {
  beforeEach(() => {
    mockAxiosDelete.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("removes a registered team and invalidates event participants", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    mockAxiosDelete.mockResolvedValue({ data: { data: { success: true } } });

    renderWithQueryClient(
      <ParticipantList
        event={4}
        registeredTeams={[
          {
            team_id: 12,
            player1name: "Ada Lovelace",
            player2name: "Grace Hopper",
          },
        ]}
      />,
      queryClient
    );

    await user.click(
      screen.getByRole("button", {
        name: "Remove team Ada Lovelace & Grace Hopper from event",
      })
    );

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });

    expect(axios.delete).toHaveBeenCalledWith("/api/events/4/teams/12");

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "event-participants",
        4,
      ]);
    });
  });
});
