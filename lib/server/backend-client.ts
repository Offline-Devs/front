/**
 * @file lib/server/backend-client.ts
 * @description Server-only HTTP client for Go backend communication.
 *
 * backendFetch(path, init) — wraps fetch with a per-request AbortController
 *   timeout (serverEnv.apiTimeoutMs). Always sets cache:"no-store" so BFF
 *   responses are never stale. Used by all BFF route handlers and server
 *   layouts that communicate with the backend.
 *
 * refreshServerSession(session) — sends the stored refresh token to the
 *   backend /auth/refresh endpoint and returns an updated ServerSession
 *   (new access token + expiry). Implements a single-flight deduplication
 *   map so concurrent requests sharing one refresh token make only one
 *   backend call, preventing refresh-token race conditions under load.
 */
import "server-only";

import { serverEnv } from "@/config/server-env";
import type { BackendRefreshResponse } from "@/types/auth";
import type { ServerSession } from "./session-codec";

export async function backendFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.apiTimeoutMs);
  try {
    return await fetch(`${serverEnv.apiBaseUrl}${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

const refreshFlights = new Map<string, Promise<ServerSession | null>>();

// Concurrent requests sharing one refresh token also share one backend refresh call.
export function refreshServerSession(session: ServerSession) {
  const existing = refreshFlights.get(session.refreshToken);
  if (existing) return existing;
  const flight = (async () => {
    const response = await backendFetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as BackendRefreshResponse;
    return {
      ...session,
      accessToken: data.access_token,
      accessExpiresAt: Date.now() + data.expires_in * 1000,
    };
  })()
    .catch(() => null)
    .finally(() => refreshFlights.delete(session.refreshToken));
  refreshFlights.set(session.refreshToken, flight);
  return flight;
}
