/**
 * @file app/api/auth/refresh/route.ts
 * @description BFF route: refreshes the access token using the stored refresh token.
 *
 * POST /api/auth/refresh
 *   Validates same-origin, reads the current session, calls
 *   refreshServerSession() which sends the refresh token to the backend
 *   /auth/refresh endpoint. On success writes the updated session (new
 *   access token + expiry) back to the cookie and returns { user, expires_in }.
 *   Clears the session and returns 401 if the refresh token is invalid.
 */
import { refreshServerSession } from "@/lib/server/backend-client";
import { clearSession, readSession, writeSession } from "@/lib/server/session";
import { isSameOriginMutation } from "@/lib/server/route-utils";
import type { SessionResponse } from "@/types/auth";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });
  const current = await readSession();
  if (!current) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const refreshed = await refreshServerSession(current);
  if (!refreshed) {
    await clearSession();
    return Response.json({ error: "invalid refresh token" }, { status: 401 });
  }
  await writeSession(refreshed);
  return Response.json(
    {
      user: refreshed.user,
      expires_in: Math.max(0, Math.floor((refreshed.accessExpiresAt - Date.now()) / 1000)),
    } satisfies SessionResponse,
    { headers: { "Cache-Control": "no-store" } },
  );
}
