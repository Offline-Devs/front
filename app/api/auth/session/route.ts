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
