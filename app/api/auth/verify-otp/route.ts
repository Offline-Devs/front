/**
 * @file app/api/auth/verify-otp/route.ts
 * @description BFF route: verifies OTP and writes the encrypted session cookie.
 *
 * POST /api/auth/verify-otp
 *   Validates same-origin, forwards body to backend /auth/verify-otp.
 *   On success, extracts access_token, refresh_token, expires_in, and user
 *   from the backend response, encrypts them into a JWE session cookie via
 *   writeSession(), then returns only { user, expires_in } to the browser.
 *   Tokens are never sent to the client.
 */
import { backendFetch } from "@/lib/server/backend-client";
import { writeSession } from "@/lib/server/session";
import {
  copyResponse,
  errorResponse,
  isSameOriginMutation,
  responseBody,
} from "@/lib/server/route-utils";
import type { BackendAuthResponse, SessionResponse } from "@/types/auth";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });
  try {
    const upstream = await backendFetch("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") ?? "application/json" },
      body: await request.arrayBuffer(),
    });
    if (!upstream.ok) return copyResponse(upstream, await responseBody(upstream));
    const data = (await upstream.json()) as BackendAuthResponse;
    await writeSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessExpiresAt: Date.now() + data.expires_in * 1000,
      user: data.user,
    });
    return Response.json(
      { user: data.user, expires_in: data.expires_in } satisfies SessionResponse,
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
