import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorBody } from "@/types/api";
import { describeApiError } from "./error-catalog";

export class ApiError extends Error { public readonly code; public readonly retryable; constructor(public status: number, public body: ApiErrorBody) { const descriptor = describeApiError(status, body); super(descriptor.message); this.name = "ApiError"; this.code = descriptor.code; this.retryable = descriptor.retryable; } }
type RequestOptions = RequestInit & { auth?: boolean };

// Requests use same-origin BFF endpoints; the browser never handles bearer or refresh tokens.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth: _auth, headers, ...init } = options; void _auth;
  const url = path.startsWith("/api/") ? path : `${env.apiBasePath}${path}`;
  const response = await fetch(url, { ...init, credentials: "same-origin", headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...headers } });
  if (!response.ok) { const body = await response.json().catch(() => ({ error: "unknown network error" })) as ApiErrorBody; if (response.status === 401) useAuthStore.getState().setUnauthenticated(); throw new ApiError(response.status, body); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
