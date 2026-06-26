import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SmoothScroll from "./SmoothScroll";

const { mockReactLenis } = vi.hoisted(() => ({
  mockReactLenis: vi.fn(),
}));

vi.mock("lenis/react", () => ({
  ReactLenis: ({ children, ...props }) => {
    mockReactLenis(props);
    return <div data-testid="react-lenis">{children}</div>;
  },
}));

describe("SmoothScroll", () => {
  it("wraps children with the shared Lenis root configuration", () => {
    render(
      <SmoothScroll>
        <div>Child content</div>
      </SmoothScroll>
    );

    expect(screen.getByTestId("react-lenis")).toHaveTextContent("Child content");
    expect(mockReactLenis).toHaveBeenCalledWith({
      options: {
        smoothTouch: true,
        syncTouch: true,
      },
      root: true,
    });
  });
});
