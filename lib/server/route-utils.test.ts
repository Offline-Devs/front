// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isSameOriginMutation } from "./route-utils";

describe("same-origin mutation validation", () => {
  it("uses the public reverse-proxy origin instead of the internal application port", () => {
    const request = new Request("http://web:3000/api/auth/request-otp", { method: "POST", headers: { host: "localhost", origin: "http://localhost", "x-forwarded-proto": "http" } });
    expect(isSameOriginMutation(request)).toBe(true);
  });

  it("rejects a cross-origin mutation", () => {
    const request = new Request("http://web:3000/api/auth/request-otp", { method: "POST", headers: { host: "localhost", origin: "https://attacker.example", "x-forwarded-proto": "http" } });
    expect(isSameOriginMutation(request)).toBe(false);
  });
});
