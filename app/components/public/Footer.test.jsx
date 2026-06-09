import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the contact prompt and coordinator link", () => {
    render(<Footer />);

    expect(
      screen.getByRole("heading", { level: 5, name: "Any questions?" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get in touch" })
    ).toHaveAttribute("href", "mailto:ladiesdoublesleague@gmail.com");
  });
});
