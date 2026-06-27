/**
 * @file services/api/client.ts
 * @description Typed fetch wrapper and ApiError class for all BFF API requests.
 *
 * Architecture note — same-origin BFF pattern:
 *   All API calls from browser components go to Next.js BFF routes under /api/.
 *   The BFF injects the Bearer token from the encrypted HttpOnly session cookie
 *   before forwarding to the Go backend. The browser never handles raw tokens.
 *
 * ApiError:
 *   Thrown by apiRequest on any non-OK response. Carries:
 *     status      — the HTTP status code
 *     body        — the raw { error: string } body from the backend
 *     code        — a controlled ApiErrorCode from the error catalog
 *     message     — a user-facing Persian string (never raw backend text)
 *     retryable   — whether the client should offer a retry button
 *     retryAfterSeconds — from the Retry-After header (rate-limit responses)
 *     rateLimit   — { limit, remaining, resetAt } from X-RateLimit-* headers
 *
 * apiRequest<T>(path, options):
 *   - Paths starting with /api/ are used as-is (BFF auth routes).
 *   - All other paths are prefixed with env.apiBasePath (default: /api/v1).
 *   - FormData bodies omit the Content-Type header so the browser sets the
 *     correct multipart boundary automatically.
 *   - On 401 the auth store is set to "unauthenticated" to trigger UI guards.
 *   - 204 No Content responses return undefined cast to T.
 */
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorBody } from "@/types/api";
import { describeApiError } from "./error-catalog";

export class ApiError extends Error {
  public readonly code;
  public readonly retryable;
  public readonly retryAfterSeconds?: number;
  public readonly rateLimit?: { limit?: number; remaining?: number; resetAt?: number };
  constructor(
    public status: number,
    public body: ApiErrorBody,
    headers?: Headers,
  ) {
    const descriptor = describeApiError(status, body);
    super(descriptor.message);
    this.name = "ApiError";
    this.code = descriptor.code;
    this.retryable = descriptor.retryable;
    const numberHeader = (name: string) => {
      const raw = headers?.get(name);
      if (!raw?.trim()) return undefined;
      const value = Number(raw);
      return Number.isFinite(value) && value >= 0 ? value : undefined;
    };
    this.retryAfterSeconds = numberHeader("retry-after");
    const limit = numberHeader("x-ratelimit-limit");
    const remaining = numberHeader("x-ratelimit-remaining");
    const resetAt = numberHeader("x-ratelimit-reset");
    if (limit !== undefined || remaining !== undefined || resetAt !== undefined)
      this.rateLimit = { limit, remaining, resetAt };
  }
}
type RequestOptions = RequestInit & { auth?: boolean };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth: _auth, headers, ...init } = options;
  void _auth;
  const url = path.startsWith("/api/") ? path : `${env.apiBasePath}${path}`;
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  });
  if (!response.ok) {
    const body = (await response
      .json()
      .catch(() => ({ error: "unknown network error" }))) as ApiErrorBody;
    if (response.status === 401) useAuthStore.getState().setUnauthenticated();
    throw new ApiError(response.status, body, response.headers);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
