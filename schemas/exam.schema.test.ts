import { describe, expect, it } from "vitest";
import { examSchema } from "./exam.schema";

const validExam = {
  title: "آزمون جامع",
  jalali_date: "۱۴۰۵-۰۳-۳۱",
  negative_mark: 0.25,
  dynamic_fields: {},
  subjects: [
    { subject_name: "زیست", total_questions: 20, answered: 18, correct: 14, wrong: 4, blank: 2 },
  ],
};

describe("exam schema invariants", () => {
  it("normalizes a valid exam date", () => {
    expect(examSchema.parse(validExam).jalali_date).toBe("1405/03/31");
  });
  it("rejects an invalid negative mark", () => {
    expect(examSchema.safeParse({ ...validExam, negative_mark: 1.1 }).success).toBe(false);
  });
  it("rejects inconsistent answer totals", () => {
    const result = examSchema.safeParse({
      ...validExam,
      subjects: [{ ...validExam.subjects[0], answered: 17 }],
    });
    expect(result.success).toBe(false);
  });
  it("rejects duplicate subjects", () => {
    const result = examSchema.safeParse({
      ...validExam,
      subjects: [validExam.subjects[0], { ...validExam.subjects[0] }],
    });
    expect(result.success).toBe(false);
  });
});
