import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorBody } from "@/types/api";
import type { RefreshResponse } from "@/types/auth";

export class ApiError extends Error { constructor(public status: number, public body: ApiErrorBody) { super(body.error); } }
type RequestOptions = RequestInit & { auth?: boolean; retryAuth?: boolean };
let refreshPromise: Promise<string> | null = null;

// fetch wrapper مرکزی: JSON/error، Bearer token و refresh تک‌پروازه را مدیریت می‌کند تا چند 401 همزمان refresh stampede نسازند.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, retryAuth = true, headers, ...init } = options;
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${env.apiBaseUrl}${path}`, { ...init, headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(auth && token ? { Authorization: `Bearer ${token}` } : {}), ...headers } });
  if (response.status === 401 && auth && retryAuth && useAuthStore.getState().refreshToken) {
    const newToken = await refreshAccessToken();
    return apiRequest<T>(path, { ...options, headers: { ...headers, Authorization: `Bearer ${newToken}` }, retryAuth: false });
  }
  if (!response.ok) { const body = await response.json().catch(() => ({ error: "خطای ناشناخته شبکه" })) as ApiErrorBody; throw new ApiError(response.status, body); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function refreshAccessToken() {
  if (!refreshPromise) refreshPromise = (async () => { const refreshToken = useAuthStore.getState().refreshToken; if (!refreshToken) throw new ApiError(401, { error: "نشست منقضی شده است" }); const data = await apiRequest<RefreshResponse>("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }), auth: false }); useAuthStore.getState().setAccessToken(data.access_token); return data.access_token; })().catch((error) => { useAuthStore.getState().clearSession(); throw error; }).finally(() => { refreshPromise = null; });
  return refreshPromise;
}
