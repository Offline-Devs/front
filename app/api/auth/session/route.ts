/**
 * @file app/api/auth/session/route.ts
 * @description BFF route: reads the current session from the encrypted cookie.
 *
 * GET /api/auth/session
 *   Decodes the HttpOnly JWE session cookie via readSession() and returns
 *   { user, expires_in } (remaining seconds). Returns 401 when no valid
 *   session exists. Used by SessionBootstrap on mount to hydrate the auth
 *   store without exposing any token to client-side JavaScript.
 */
import { readSession } from "@/lib/server/session";
import type { SessionResponse } from "@/types/auth";

export async function GET() {
  const session = await readSession();
  if (!session) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const expiresIn = Math.max(0, Math.floor((session.accessExpiresAt - Date.now()) / 1000));
  return Response.json({ user: session.user, expires_in: expiresIn } satisfies SessionResponse, {
    headers: { "Cache-Control": "no-store" },
  });
}
