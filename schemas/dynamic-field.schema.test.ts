import { describe, expect, it } from "vitest";
import { dynamicFieldSchema } from "./dynamic-field.schema";
const base = {
  entity_type: "student",
  name: "grade",
  label: "پایه",
  field_type: "select",
  options: '["یازدهم","دوازدهم"]',
  is_required: true,
} as const;
describe("dynamic field schema", () => {
  it("accepts string-array select options", () => {
    expect(dynamicFieldSchema.safeParse(base).success).toBe(true);
  });
  it("rejects malformed options", () => {
    expect(dynamicFieldSchema.safeParse({ ...base, options: "{}" }).success).toBe(false);
  });
  it("rejects unsafe technical names", () => {
    expect(dynamicFieldSchema.safeParse({ ...base, name: "Grade Name" }).success).toBe(false);
  });
});
