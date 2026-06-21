import { describe, expect, it } from "vitest";
import { authDestination, normalizeIranianPhone, normalizeNumericInput } from "./auth-flow";

describe("authentication flow helpers", () => {
  it.each([
    ["0912 123 4567", "+989121234567"],
    ["۹۱۲۱۲۳۴۵۶۷", "+989121234567"],
    ["00989121234567", "+989121234567"],
    ["+989121234567", "+989121234567"],
  ])("normalizes Iranian phone %s", (input, expected) => {
    expect(normalizeIranianPhone(input)).toBe(expected);
  });

  it("normalizes Persian and Arabic digits", () => {
    expect(normalizeNumericInput("۱۲٣٤۵۶")).toBe("123456");
  });

  it("selects a destination from role and profile state", () => {
    expect(authDestination("admin")).toBe("/admin");
    expect(authDestination("student", false)).toBe("/complete-profile");
    expect(authDestination("student", true)).toBe("/dashboard");
  });
});
