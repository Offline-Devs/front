import type { ApiErrorBody } from "@/types/api";

export async function responseBody(response: Response) { return response.arrayBuffer(); }
export function copyResponse(response: Response, body: BodyInit | null) { const headers = new Headers(); for (const name of ["content-type", "content-disposition", "cache-control", "etag", "last-modified", "retry-after"]) { const value = response.headers.get(name); if (value) headers.set(name, value); } return new Response(body, { status: response.status, headers }); }
export function errorResponse(error: unknown) { const timedOut = error instanceof Error && error.name === "AbortError"; const body: ApiErrorBody = { error: timedOut ? "backend request timed out" : "backend unavailable" }; return Response.json(body, { status: timedOut ? 504 : 502 }); }
export function isSameOriginMutation(request: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  const publicOrigin = host ? `${protocol}://${host}` : requestUrl.origin;
  try { return new URL(origin).origin === new URL(publicOrigin).origin; } catch { return false; }
}
