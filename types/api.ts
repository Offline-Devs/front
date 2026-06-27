/**
 * @file types/api.ts
 * @description Shared API envelope types used across all service modules.
 *
 * ApiErrorBody     — the { error: string } shape returned by the Go backend on
 *                    any non-OK response. Consumed by ApiError in client.ts.
 * StatusResponse   — returned by admin mutation endpoints (approve, update, delete)
 *                    that do not return the full entity on success.
 * PaginatedResponse<T> — wraps paginated list responses with data, total, page,
 *                    and limit. Used by the admin students endpoint.
 * ApiErrorCode     — union of canonical error code strings assigned by the error
 *                    catalog. Components can branch on code for specific handling
 *                    (e.g. rate_limited → show Retry-After countdown).
 */
// Shared API envelopes. Most backend handlers return entities directly, while paginated collections use a stable `data` and `total` shape.
export type ApiErrorBody = { error: string };
export type StatusResponse = { status: "updated" | "deleted" | "approved" | "published" };
export type PaginatedResponse<T> = { data: T[]; total: number; page: number; limit: number };
export type ApiErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation"
  | "rate_limited"
  | "backend_unavailable"
  | "timeout"
  | "server_error"
  | "unknown";
