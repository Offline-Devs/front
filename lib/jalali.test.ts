import { describe, expect, it } from "vitest";
import { normalizeJalaliDate } from "./jalali";
describe("Jalali normalization", () => {
  it("zero-pads month and day", () => {
    expect(normalizeJalaliDate("1405/3/1")).toBe("1405/03/01");
  });
  it("rejects malformed input", () => {
    expect(() => normalizeJalaliDate("1405/03")).toThrow();
  });
});
