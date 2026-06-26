import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import LeagueModal from "./LeagueModal";

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

describe("LeagueModal", () => {
  beforeEach(() => {
    mockAxiosDelete.mockReset();
    mockAxiosPost.mockReset();
    mockAxiosPut.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a league with a direct payload", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const setShowModal = vi.fn();

    mockAxiosPost.mockResolvedValue({ data: { data: { id: 8 } } });

    renderWithQueryClient(
      <LeagueModal mode="create" setShowModal={setShowModal} />,
      queryClient
    );

    await user.type(screen.getByLabelText("League name:"), "Autumn League");
    await user.type(screen.getByLabelText("Start date:"), "2026-09-01");
    await user.type(screen.getByLabelText("Midway point:"), "2026-10-01");
    await user.type(screen.getByLabelText("End date:"), "2026-11-01");
    await user.click(screen.getByRole("button", { name: "Create new league" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith("/api/leagues", {
      league_name: "Autumn League",
      starting_date: "2026-09-01",
      midway_point: "2026-10-01",
      end_date: "2026-11-01",
      isfinished: "",
    });

    await waitFor(() => {
      expect(setShowModal).toHaveBeenCalledWith(false);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["leagues"]);
    });
  });
});
