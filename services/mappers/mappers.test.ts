import { describe, expect, it } from "vitest";
import { dynamicFieldFixture, examFixture, performanceFixture } from "@/mocks/fixtures";
import { mapDynamicField } from "./dynamic-field.mapper";
import { mapExam } from "./exam.mapper";
import { mapPerformance } from "./performance.mapper";

describe("response mappers", () => {
  it("parses dynamic options and attachment URLs", () => {
    expect(mapDynamicField(dynamicFieldFixture).parsedOptions).toContain("دوازدهم");
    expect(mapPerformance(performanceFixture).attachments[0]).toContain("/api/v1/uploads/");
  });
  it("falls back to empty arrays for malformed JSON", () => {
    expect(mapDynamicField({ ...dynamicFieldFixture, options: "invalid" }).parsedOptions).toEqual(
      [],
    );
    expect(mapPerformance({ ...performanceFixture, files: "{}" }).attachments).toEqual([]);
  });
  it("applies the exam negative mark to subject percentages", () => {
    expect(mapExam(examFixture).subjects?.[0].percentage).toBeCloseTo(70.05);
  });
});
