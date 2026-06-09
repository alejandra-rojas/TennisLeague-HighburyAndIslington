import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePlayer from "./CreatePlayer";

const { mockRefresh, mockPush } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}));

describe("CreatePlayer", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    mockRefresh.mockReset();
    mockPush.mockReset();
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000";
  });

  it("submits a new player and refreshes the admin page", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValue({
      json: async () => ({
        data: { id: 1, firstname: "Ada", lastname: "Lovelace" },
      }),
    });

    render(<CreatePlayer setShowPlayerModal={vi.fn()} />);

    await user.type(screen.getByLabelText("First name:"), "Ada");
    await user.type(screen.getByLabelText("Last name:"), "Lovelace");
    await user.click(screen.getByRole("button", { name: "Add Player" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/players",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Ada",
          lastname: "Lovelace",
        }),
      })
    );

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin/players");
    });

    expect(screen.getByLabelText("First name:")).toHaveValue("");
    expect(screen.getByLabelText("Last name:")).toHaveValue("");
  });

  it("restores the idle state when the request fails", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValue({
      json: async () => ({
        error: { message: "Insert failed" },
      }),
    });

    render(<CreatePlayer setShowPlayerModal={vi.fn()} />);

    await user.type(screen.getByLabelText("First name:"), "Ada");
    await user.type(screen.getByLabelText("Last name:"), "Lovelace");
    await user.click(screen.getByRole("button", { name: "Add Player" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add Player" })).toBeEnabled();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
