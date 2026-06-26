import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SearchComponent from "./SearchComponent";

const {
  mockRefresh,
  mockPush,
  mockFrom,
  mockSelect,
  mockCreateClient,
} = vi.hoisted(() => {
  const mockRefresh = vi.fn();
  const mockPush = vi.fn();
  const mockSelect = vi.fn();
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));
  const mockCreateClient = vi.fn(() => ({
    from: mockFrom,
  }));

  return {
    mockRefresh,
    mockPush,
    mockFrom,
    mockSelect,
    mockCreateClient,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}));

vi.mock("@/supabase/client", () => ({
  createClient: mockCreateClient,
}));

describe("SearchComponent", () => {
  const players = [
    { id: 1, firstname: "Ada", lastname: "Lovelace" },
    { id: 2, firstname: "Alan", lastname: "Turing" },
    { id: 3, firstname: "Grace", lastname: "Hopper" },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
    mockRefresh.mockReset();
    mockPush.mockReset();
    mockFrom.mockClear();
    mockSelect.mockReset();
    mockCreateClient.mockClear();
    mockSelect.mockResolvedValue({ data: players });
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("filters players from the Supabase result set and can clear the search", async () => {
    const user = userEvent.setup();

    render(<SearchComponent setShowCreateTeamModal={vi.fn()} />);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith("players");
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search for players by name" }),
      "Ada"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit player search" })
    );

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Clear search results" })
    );

    expect(
      screen.getByRole("textbox", { name: "Search for players by name" })
    ).toHaveValue("");
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("prevents selecting the same player twice", async () => {
    const user = userEvent.setup();

    render(<SearchComponent setShowCreateTeamModal={vi.fn()} />);

    await user.type(
      screen.getByRole("textbox", { name: "Search for players by name" }),
      "Ada"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit player search" })
    );

    const addAdaButton = await screen.findByRole("button", {
      name: "Add Ada Lovelace to team",
    });

    await user.click(addAdaButton);
    await user.click(addAdaButton);

    expect(
      await screen.findByText("This player is already selected")
    ).toBeInTheDocument();
  });

  it("creates a team and closes the modal on success", async () => {
    const user = userEvent.setup();
    const setShowCreateTeamModal = vi.fn();

    global.fetch.mockResolvedValue({
      json: async () => ({
        data: { team_id: 12 },
      }),
    });

    render(
      <SearchComponent setShowCreateTeamModal={setShowCreateTeamModal} />
    );

    await user.type(
      screen.getByRole("textbox", { name: "Search for players by name" }),
      "a"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit player search" })
    );

    await user.click(
      await screen.findByRole("button", { name: "Add Ada Lovelace to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Add Alan Turing to team" })
    );
    await user.click(screen.getByRole("button", { name: "Create team" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/teams",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1_id: 1,
          player2_id: 2,
        }),
      })
    );

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin/teams");
      expect(setShowCreateTeamModal).toHaveBeenCalledWith(false);
    });
  });

  it("shows the API error message when team creation fails", async () => {
    const user = userEvent.setup();
    const setShowCreateTeamModal = vi.fn();

    global.fetch.mockResolvedValue({
      json: async () => ({
        error: { message: "This team already exists." },
      }),
    });

    render(
      <SearchComponent setShowCreateTeamModal={setShowCreateTeamModal} />
    );

    await user.type(
      screen.getByRole("textbox", { name: "Search for players by name" }),
      "a"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit player search" })
    );

    await user.click(
      await screen.findByRole("button", { name: "Add Ada Lovelace to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Add Alan Turing to team" })
    );
    await user.click(screen.getByRole("button", { name: "Create team" }));

    expect(
      await screen.findByText("This team already exists.")
    ).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    expect(setShowCreateTeamModal).not.toHaveBeenCalled();
  });
});
