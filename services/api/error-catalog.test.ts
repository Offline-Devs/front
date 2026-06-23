import { describe, expect, it } from "vitest";
import { describeApiError } from "./error-catalog";

describe("API error policy", () => {
  it.each([
    [401, "unauthorized", false],
    [403, "forbidden", false],
    [404, "not_found", false],
    [429, "rate_limited", true],
  ] as const)("maps status %s", (status, code, retryable) => {
    expect(describeApiError(status, { error: "unknown" })).toMatchObject({ code, retryable });
  });
  it("uses a controlled Persian message for known backend errors", () => {
    expect(describeApiError(401, { error: "invalid or expired otp" }).message).toBe(
      "کد واردشده اشتباه یا منقضی شده است.",
    );
  });
  it("describes strict mistake-reference failures", () => {
    expect(describeApiError(404, { error: "referenced exam or subject not found" }).message).toBe(
      "آزمون یا درس انتخاب‌شده دیگر در دسترس نیست.",
    );
  });
});
