import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditPlayerModal from "./EditPlayerModal";

const { mockRefresh } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

vi.mock("./DeleteButton", () => ({
  default: ({ id }) => <div data-testid="delete-button">Delete {id}</div>,
}));

describe("EditPlayerModal", () => {
  const player = {
    firstname: "Ada",
    lastname: "Lovelace",
  };

  beforeEach(() => {
    global.fetch = vi.fn();
    mockRefresh.mockReset();
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000";
  });

  it("submits updated player details and closes the modal on success", async () => {
    const user = userEvent.setup();
    const setShowPlayerModal = vi.fn();

    global.fetch.mockResolvedValue({
      json: async () => ({
        data: { id: 9, firstname: "Grace", lastname: "Hopper" },
      }),
    });

    render(
      <EditPlayerModal
        player={player}
        id={9}
        setShowPlayerModal={setShowPlayerModal}
      />
    );

    const firstNameInput = screen.getByDisplayValue("Ada");
    const lastNameInput = screen.getByDisplayValue("Lovelace");

    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Grace");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Hopper");
    await user.click(screen.getByRole("button", { name: "EDIT" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/players/9",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Grace",
          lastname: "Hopper",
        }),
      })
    );

    await waitFor(() => {
      expect(setShowPlayerModal).toHaveBeenCalledWith(false);
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it("stays open and restores the submit state on error", async () => {
    const user = userEvent.setup();
    const setShowPlayerModal = vi.fn();

    global.fetch.mockResolvedValue({
      json: async () => ({
        error: { message: "Update failed" },
      }),
    });

    render(
      <EditPlayerModal
        player={player}
        id={9}
        setShowPlayerModal={setShowPlayerModal}
      />
    );

    await user.click(screen.getByRole("button", { name: "EDIT" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "EDIT" })).toBeEnabled();
    });

    expect(setShowPlayerModal).not.toHaveBeenCalledWith(false);
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
