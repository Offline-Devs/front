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
    await expect(apiRequest("/students/profile")).rejects.toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().status).toBe("unauthenticated");
    expect(useAuthStore.getState().user).toBeNull();
  });
});
