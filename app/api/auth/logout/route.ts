import { clearSession } from "@/lib/server/session";
import { isSameOriginMutation } from "@/lib/server/route-utils";

export async function POST(request: Request) { if (!isSameOriginMutation(request)) return Response.json({ error: "invalid origin" }, { status: 403 }); await clearSession(); return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }); }
