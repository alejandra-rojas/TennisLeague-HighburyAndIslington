import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourtHero from "./CourtHero";

const { mockScrollTo, mockUseLenis } = vi.hoisted(() => ({
  mockScrollTo: vi.fn(),
  mockUseLenis: vi.fn(),
}));

vi.mock("lenis/react", () => ({
  useLenis: mockUseLenis,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("CourtHero", () => {
  beforeEach(() => {
    mockScrollTo.mockReset();
    mockUseLenis.mockReset();
  });

  it("scrolls to the latest results section when requested", async () => {
    const user = userEvent.setup();

    mockUseLenis.mockReturnValue({
      scrollTo: mockScrollTo,
    });

    render(
      <CourtHero
        data={{ title: "Summer League", subtitle: "Doubles and fun" }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Latest results" }));

    expect(mockScrollTo).toHaveBeenCalledWith("#latest-results", {
      lerp: 0.04,
    });
  });

  it("does not crash if Lenis is not ready yet", async () => {
    const user = userEvent.setup();

    mockUseLenis.mockReturnValue(undefined);

    render(<CourtHero data={{ title: "Summer League", subtitle: "Doubles and fun" }} />);

    await user.click(screen.getByRole("button", { name: "Latest results" }));

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
