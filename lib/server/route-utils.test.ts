/**
 * @file lib/server/route-utils.test.ts
 * @description Unit tests for BFF route utility functions.
 *
 * Tests:
 *   - isSameOriginMutation correctly uses the X-Forwarded-Host / X-Forwarded-Proto
 *     headers (set by the reverse proxy) rather than the internal container host.
 *   - Cross-origin mutations are rejected.
 *   - copyResponse forwards rate-limit headers (Retry-After, X-RateLimit-*)
 *     and strips unrelated internal headers from the upstream response.
 */
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { copyResponse, isSameOriginMutation } from "./route-utils";

describe("same-origin mutation validation", () => {
  it("uses the public reverse-proxy origin instead of the internal application port", () => {
    const request = new Request("http://web:3000/api/auth/request-otp", {
      method: "POST",
      headers: { host: "localhost", origin: "http://localhost", "x-forwarded-proto": "http" },
    });
    expect(isSameOriginMutation(request)).toBe(true);
  });

  it("rejects a cross-origin mutation", () => {
    const request = new Request("http://web:3000/api/auth/request-otp", {
      method: "POST",
      headers: {
        host: "localhost",
        origin: "https://attacker.example",
        "x-forwarded-proto": "http",
      },
    });
    expect(isSameOriginMutation(request)).toBe(false);
  });

  it("forwards rate-limit metadata without forwarding unrelated headers", () => {
    const upstream = new Response(null, {
      status: 429,
      headers: {
        "Retry-After": "17",
        "X-RateLimit-Limit": "60",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "1782144000",
        "X-Internal-Secret": "hidden",
      },
    });
    const response = copyResponse(upstream, null);
    expect(response.headers.get("retry-after")).toBe("17");
    expect(response.headers.get("x-ratelimit-remaining")).toBe("0");
    expect(response.headers.get("x-internal-secret")).toBeNull();
  });
});
