import { describe, expect, it } from "vitest";
import { daysInJalaliMonth, isJalaliLeapYear } from "./jalali-date-picker";

describe("Jalali date picker calendar", () => {
  it("uses the correct month lengths", () => {
    expect(daysInJalaliMonth(1405, 1)).toBe(31);
    expect(daysInJalaliMonth(1405, 7)).toBe(30);
    expect(daysInJalaliMonth(1405, 12)).toBe(29);
  });

  it("allows Esfand 30 only in leap years", () => {
    expect(isJalaliLeapYear(1403)).toBe(true);
    expect(daysInJalaliMonth(1403, 12)).toBe(30);
  });
});
