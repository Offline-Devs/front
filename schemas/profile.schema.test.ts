import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile.schema";

const validProfile = {
  first_name: "علی",
  last_name: "محمدی",
  city: "تهران",
  jalali_birth_date: "۱۳۸۵-۰۷-۱۵",
  school: "دبیرستان نمونه",
  major: "تجربی",
  profile_photo: "",
  dynamic_fields: {},
};

describe("profile schema", () => {
  it("normalizes Persian digits and date separators", () => {
    expect(profileSchema.parse(validProfile).jalali_birth_date).toBe("1385/07/15");
  });

  it("rejects day 31 after the first six Jalali months", () => {
    expect(
      profileSchema.safeParse({ ...validProfile, jalali_birth_date: "1400/07/31" }).success,
    ).toBe(false);
  });
});
