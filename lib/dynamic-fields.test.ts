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
