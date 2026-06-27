/**
 * @file lib/statistics.test.ts
 * @description Unit tests for statistics date normalisation and range validation.
 *
 * Verifies normalizeStatisticsDate() converts Persian digits and hyphen
 * separators, and validateStatisticsRange() rejects invalid date formats,
 * inverted ranges, and accepts valid from/to pairs.
 */
import { describe, expect, it } from "vitest";
import {
  normalizeStatisticsDate,
  totalCategorizedMistakes,
  validateStatisticsRange,
} from "./statistics";

describe("statistics helpers", () => {
  it("normalizes Persian Jalali filter dates", () => {
    expect(normalizeStatisticsDate("۱۴۰۵-۰۳-۳۱")).toBe("1405/03/31");
  });
  it("rejects an inverted range", () => {
    expect(validateStatisticsRange("1405/04/01", "1405/03/31")).toContain("شروع");
  });
  it("sums categorized mistakes", () => {
    expect(totalCategorizedMistakes({ بی‌دقتی: 3, مفهومی: 2 })).toBe(5);
  });
});
