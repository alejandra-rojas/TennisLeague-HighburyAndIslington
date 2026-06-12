import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeleteButton from "./DeleteButton";

const { mockRefresh, mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

describe("DeleteButton", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    mockRefresh.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  it("deletes the player and refreshes the page on success", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValue({
      json: async () => ({
        success: true,
      }),
    });

    render(<DeleteButton id={7} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/players/7",
      expect.objectContaining({
        method: "DELETE",
      })
    );

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Player deleted succesfully");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it("shows an error toast and restores the button state on failure", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValue({
      json: async () => ({
        error: {
          message: "Cannot delete player.",
        },
      }),
    });

    render(<DeleteButton id={7} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Cannot delete player.");
    });

    expect(mockRefresh).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });
});
