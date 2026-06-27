/**
 * @file lib/server/route-utils.ts
 * @description Shared utility functions for Next.js BFF route handlers.
 *
 * responseBody(response)    — reads the response body as an ArrayBuffer for
 *   transparent proxying without text decoding overhead.
 *
 * copyResponse(response, body) — constructs a new Response with a curated
 *   subset of the upstream headers (content-type, cache-control, rate-limit
 *   headers, etc.) and the provided body. Strips internal headers that must
 *   not be forwarded to the browser.
 *
 * errorResponse(error)      — converts a network / timeout error into a
 *   structured 502 or 504 JSON response using the canonical backend error
 *   body shape ({ error: string }).
 *
 * isSameOriginMutation(request) — validates that a mutation request's Origin
 *   header matches the public host (accounting for reverse-proxy forwarded
 *   headers). GET and HEAD requests always pass. Returns false for
 *   cross-origin mutations to prevent CSRF.
 */
import type { ApiErrorBody } from "@/types/api";

export async function responseBody(response: Response) {
  return response.arrayBuffer();
}
export function copyResponse(response: Response, body: BodyInit | null) {
  const headers = new Headers();
  for (const name of [
    "content-type",
    "content-disposition",
    "cache-control",
    "etag",
    "last-modified",
    "retry-after",
    "x-ratelimit-limit",
    "x-ratelimit-remaining",
    "x-ratelimit-reset",
  ]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(body, { status: response.status, headers });
}
export function errorResponse(error: unknown) {
  const timedOut = error instanceof Error && error.name === "AbortError";
  const body: ApiErrorBody = {
    error: timedOut ? "backend request timed out" : "backend unavailable",
  };
  return Response.json(body, { status: timedOut ? 504 : 502 });
}
export function isSameOriginMutation(request: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  const publicOrigin = host ? `${protocol}://${host}` : requestUrl.origin;
  try {
    return new URL(origin).origin === new URL(publicOrigin).origin;
  } catch {
    return false;
  }
}
