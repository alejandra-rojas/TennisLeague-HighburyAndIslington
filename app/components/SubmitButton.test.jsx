import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SubmitButton from "./SubmitButton";

const { mockUseFormStatus } = vi.hoisted(() => ({
  mockUseFormStatus: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");

  return {
    ...actual,
    useFormStatus: mockUseFormStatus,
  };
});

describe("SubmitButton", () => {
  beforeEach(() => {
    mockUseFormStatus.mockReset();
  });

  it("renders the default submit state", () => {
    mockUseFormStatus.mockReturnValue({ pending: false });

    render(<SubmitButton />);

    expect(
      screen.getByRole("button", { name: "Submit" })
    ).not.toBeDisabled();
  });

  it("renders the pending state", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });

    render(<SubmitButton />);

    expect(
      screen.getByRole("button", { name: "Submitting.." })
    ).toBeDisabled();
  });
});
