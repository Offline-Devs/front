/**
 * @file app/api/auth/logout/route.ts
 * @description BFF route: clears the session cookie on logout.
 *
 * POST /api/auth/logout
 *   Validates same-origin then calls clearSession() to overwrite the
 *   HttpOnly session cookie with an empty value and maxAge=0. Returns 204.
 *   The client-side useLogout hook clears the TanStack Query cache and
 *   Zustand auth store after this call completes.
 */
import { clearSession } from "@/lib/server/session";
import { isSameOriginMutation } from "@/lib/server/route-utils";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });
  await clearSession();
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
