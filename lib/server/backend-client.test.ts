import { afterEach, describe, expect, it, vi } from "vitest";
import { userFixture } from "@/mocks/fixtures";
import type { ServerSession } from "./session-codec";

vi.mock("server-only", () => ({}));

describe("server refresh single-flight", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("uses one backend call for concurrent refreshes", async () => {
    const fetchMock = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return Response.json({ access_token: "new-access", expires_in: 3600 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const { refreshServerSession } = await import("./backend-client");
    const session: ServerSession = {
      accessToken: "old",
      refreshToken: "shared-refresh",
      accessExpiresAt: 0,
      user: userFixture,
    };
    const results = await Promise.all([
      refreshServerSession(session),
      refreshServerSession(session),
      refreshServerSession(session),
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(results.every((result) => result?.accessToken === "new-access")).toBe(true);
  });
});
