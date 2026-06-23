import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input mobile keyboards", () => {
  it.each(["number", "tel"] as const)("uses a numeric keypad for %s inputs", (type) => {
    render(<Input aria-label="numeric field" type={type} />);
    expect(screen.getByLabelText("numeric field")).toHaveAttribute("inputmode", "numeric");
  });

  it("preserves an explicit decimal keypad", () => {
    render(<Input aria-label="decimal field" type="number" inputMode="decimal" />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("inputmode", "decimal");
  });
});
