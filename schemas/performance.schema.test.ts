/**
 * @file schemas/performance.schema.test.ts
 * @description Unit tests for the performance report schema.
 *
 * Verifies Jalali date normalisation from Persian digits and that submitting
 * a report with both notes and study_plan empty fails validation.
 */
import { describe, expect, it } from "vitest";
import { performanceSchema } from "./performance.schema";

describe("performance schema", () => {
  it("normalizes the Jalali date", () => {
    expect(
      performanceSchema.parse({
        jalali_date: "۱۴۰۵-۰۳-۳۱",
        notes: "گزارش",
        study_plan: "",
        files: [],
      }).jalali_date,
    ).toBe("1405/03/31");
  });
  it("requires notes or a study plan", () => {
    expect(
      performanceSchema.safeParse({
        jalali_date: "1405/03/31",
        notes: "",
        study_plan: "",
        files: [],
      }).success,
    ).toBe(false);
  });
});
