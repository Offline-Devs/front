import { describe, expect, it } from "vitest";
import { sanitizeTelemetry } from "./observability";

describe("telemetry sanitization", () => {
  it("keeps only allow-listed non-sensitive fields", () => {
    const result = sanitizeTelemetry({ type: "error", name: "TypeError", route: "/profile?token=secret", digest: "abc", accessToken: "secret", email: "a@b.test" });
    expect(result).toEqual({ type: "error", name: "TypeError", route: "/profile", digest: "abc" });
    expect(JSON.stringify(result)).not.toContain("secret");
  });
  it("rejects malformed events", () => expect(sanitizeTelemetry({ type: "audit", name: "x" })).toBeNull());
});
