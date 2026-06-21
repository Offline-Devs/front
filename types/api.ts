// قراردادهای عمومی پاسخ؛ بک‌اند بیشتر endpointها را مستقیم و لیست صفحه‌دار را با data/total برمی‌گرداند.
export type ApiErrorBody = { error: string };
export type StatusResponse = { status: "updated" | "deleted" | "approved" | "published" };
export type PaginatedResponse<T> = { data: T[]; total: number; page: number; limit: number };
export type PaginationParams = { page?: number; limit?: number };
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
