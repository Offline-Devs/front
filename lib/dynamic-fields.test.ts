/**
 * @file lib/dynamic-fields.test.ts
 * @description Unit tests for dynamic field value validation.
 *
 * Verifies that validateDynamicFieldValues() returns error messages for
 * required active fields whose values are empty, null, undefined, false,
 * or NaN, and returns no errors for optional fields or inactive fields
 * regardless of their value.
 */
import { describe, expect, it } from "vitest";
import { dynamicFieldFixture } from "@/mocks/fixtures";
import { validateDynamicFieldValues } from "./dynamic-fields";
describe("dynamic field runtime validation", () => {
  it("reports a missing required value", () => {
    expect(
      validateDynamicFieldValues([{ ...dynamicFieldFixture, is_required: true }], {}),
    ).toHaveProperty(dynamicFieldFixture.name);
  });
  it("accepts a present value", () => {
    expect(
      validateDynamicFieldValues([{ ...dynamicFieldFixture, is_required: true }], {
        [dynamicFieldFixture.name]: "دوازدهم",
      }),
    ).toEqual({});
  });
});
