import { afterEach, describe, expect, it, vi } from "vitest";
import { userFixture } from "@/mocks/fixtures";
import { useAuthStore } from "@/stores/auth-store";
import { apiRequest, ApiError } from "./client";

describe("browser API client", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("clears visible auth state after a terminal 401", async () => {
    useAuthStore.getState().setUser(userFixture);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: "unauthenticated" }, { status: 401 })),
    );
    const error = await apiRequest("/students/profile").catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).retryAfterSeconds).toBeUndefined();
    expect((error as ApiError).rateLimit).toBeUndefined();
    expect(useAuthStore.getState().status).toBe("unauthenticated");
    expect(useAuthStore.getState().user).toBeNull();
  });
  it("exposes backend rate-limit metadata", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: "rate limit exceeded" },
          {
            status: 429,
            headers: {
              "Retry-After": "17",
              "X-RateLimit-Limit": "60",
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": "1782144000",
            },
          },
        ),
      ),
    );
    const error = await apiRequest("/students/profile").catch((reason: unknown) => reason);
    expect(error).toMatchObject({
      status: 429,
      retryAfterSeconds: 17,
      rateLimit: { limit: 60, remaining: 0, resetAt: 1782144000 },
    });
  });
});
