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
