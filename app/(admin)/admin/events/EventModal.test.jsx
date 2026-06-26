import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import EventModal from "./EventModal";

const { mockAxiosDelete, mockAxiosPost, mockAxiosPut } = vi.hoisted(() => ({
  mockAxiosDelete: vi.fn(),
  mockAxiosPost: vi.fn(),
  mockAxiosPut: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    delete: mockAxiosDelete,
    post: mockAxiosPost,
    put: mockAxiosPut,
  },
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("EventModal", () => {
  beforeEach(() => {
    mockAxiosDelete.mockReset();
    mockAxiosPost.mockReset();
    mockAxiosPut.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates an event with a direct payload", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const setShowEventModal = vi.fn();

    mockAxiosPost.mockResolvedValue({ data: { data: { event_id: 9 } } });

    renderWithQueryClient(
      <EventModal
        mode="create"
        leagueID={7}
        league_name="Autumn League"
        setShowEventModal={setShowEventModal}
      />,
      queryClient
    );

    await user.type(screen.getByLabelText("Event name:"), "Division A");
    await user.type(
      screen.getByLabelText("Matches to play for midpoint bonus:"),
      "3"
    );
    await user.click(screen.getByRole("button", { name: "Create new event" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith("/api/leagues/7/events", {
      event_name: "Division A",
      midway_matches: "3",
    });

    await waitFor(() => {
      expect(setShowEventModal).toHaveBeenCalledWith(false);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["events", 7]);
    });
  });
});
