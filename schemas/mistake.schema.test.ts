import { describe, expect, it } from "vitest";
import { mistakeSchema } from "./mistake.schema";

describe("mistake schema", () => {
  it("turns empty relation selections into undefined", () => { const result = mistakeSchema.parse({ exam_id: "", subject_exam_id: "", question_number: 2, category: "بی‌دقتی", notes: "", dynamic_fields: {} }); expect(result.exam_id).toBeUndefined(); expect(result.subject_exam_id).toBeUndefined(); });
  it("requires a positive question number", () => { expect(mistakeSchema.safeParse({ exam_id: "", subject_exam_id: "", question_number: 0, category: "بی‌دقتی", notes: "", dynamic_fields: {} }).success).toBe(false); });
});
