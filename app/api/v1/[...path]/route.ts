import { backendFetch, refreshServerSession } from "@/lib/server/backend-client";
import { clearSession, readSession, writeSession } from "@/lib/server/session";
import { copyResponse, errorResponse, isSameOriginMutation } from "@/lib/server/route-utils";

const DROPPED_HEADERS = new Set(["host", "content-length", "connection", "authorization", "cookie"]);

async function proxyRequest(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!isSameOriginMutation(request)) return Response.json({ error: "invalid origin" }, { status: 403 });
  const { path } = await context.params; const incomingUrl = new URL(request.url); const backendPath = `/${path.map(encodeURIComponent).join("/")}${incomingUrl.search}`;
  const headers = new Headers(); request.headers.forEach((value, key) => { if (!DROPPED_HEADERS.has(key.toLowerCase())) headers.set(key, value); });
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  let session = await readSession();

  try {
    if (session && session.accessExpiresAt <= Date.now() + 10_000) { session = await refreshServerSession(session); if (session) await writeSession(session); else await clearSession(); }
    const perform = (accessToken?: string) => { const requestHeaders = new Headers(headers); if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`); return backendFetch(backendPath, { method: request.method, headers: requestHeaders, body }); };
    let upstream = await perform(session?.accessToken);
    if (upstream.status === 401 && session) { const refreshed = await refreshServerSession(session); if (refreshed) { await writeSession(refreshed); upstream = await perform(refreshed.accessToken); } else { await clearSession(); } }
    return copyResponse(upstream, upstream.body);
  } catch (error) { return errorResponse(error); }
}

export const GET = proxyRequest; export const POST = proxyRequest; export const PUT = proxyRequest; export const PATCH = proxyRequest; export const DELETE = proxyRequest; export const OPTIONS = proxyRequest;
