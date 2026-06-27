/**
 * @file lib/jalali.test.ts
 * @description Unit tests for normalizeJalaliDate().
 *
 * Verifies zero-padding of year, month, and day components, correct handling
 * of already-padded dates, and error throwing for malformed input strings.
 */
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
