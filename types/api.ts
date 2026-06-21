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
