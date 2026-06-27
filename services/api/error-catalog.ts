/**
 * @file services/api/error-catalog.ts
 * @description Translates raw backend error responses into controlled, user-facing
 * Persian messages with retry metadata.
 *
 * Two lookup tables work together:
 *
 * STATUS_ERRORS — maps HTTP status codes to a default ErrorDescriptor.
 *   Each descriptor carries a canonical error code (ApiErrorCode), a Persian
 *   message, and a boolean indicating whether the client should offer a retry.
 *
 * BACKEND_MESSAGES — maps lower-cased backend `error` strings to Persian
 *   overrides. These take precedence over the status-code defaults so that
 *   domain-specific messages ("student approval required", "invalid jalali_date
 *   format", etc.) are shown instead of a generic status message.
 *
 * describeApiError(status, body) — the single exported function; called by
 *   ApiError in services/api/client.ts every time the backend returns a non-OK
 *   response. Components never receive raw backend text — only the resolved
 *   descriptor from this catalog.
 */
import type { ApiErrorBody, ApiErrorCode } from "@/types/api";

type ErrorDescriptor = { code: ApiErrorCode; message: string; retryable: boolean };

const STATUS_ERRORS: Record<number, ErrorDescriptor> = {
  400: { code: "bad_request", message: "اطلاعات ارسال‌شده معتبر نیست.", retryable: false },
  401: {
    code: "unauthorized",
    message: "نشست شما منقضی شده است. دوباره وارد شوید.",
    retryable: false,
  },
  403: { code: "forbidden", message: "اجازه انجام این عملیات را ندارید.", retryable: false },
  404: { code: "not_found", message: "اطلاعات موردنظر پیدا نشد.", retryable: false },
  409: {
    code: "conflict",
    message: "این تغییر با وضعیت فعلی اطلاعات سازگار نیست.",
    retryable: false,
  },
  422: { code: "validation", message: "بعضی از فیلدها معتبر نیستند.", retryable: false },
  429: {
    code: "rate_limited",
    message: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.",
    retryable: true,
  },
  500: {
    code: "server_error",
    message: "خطایی در سرور رخ داد؛ دوباره تلاش کنید.",
    retryable: true,
  },
  502: { code: "backend_unavailable", message: "ارتباط با سرور برقرار نشد.", retryable: true },
  503: { code: "backend_unavailable", message: "سرویس موقتاً در دسترس نیست.", retryable: true },
  504: { code: "timeout", message: "پاسخ سرور بیش از حد طول کشید.", retryable: true },
};

/**
 * Backend `error` field values mapped to Persian overrides.
 * Keys must be lower-cased for the case-insensitive lookup in describeApiError.
 */
const BACKEND_MESSAGES: Record<string, string> = {
  "invalid or expired otp": "کد واردشده اشتباه یا منقضی شده است.",
  "user is inactive": "حساب کاربری شما غیرفعال است.",
  "profile not found": "پروفایل هنوز تکمیل نشده است.",
  "student profile not found": "پروفایل هنوز تکمیل نشده است.",
  "student approval required":
    "تا زمانی که مدیر پروفایل شما را تأیید نکند، به این بخش دسترسی ندارید.",
  "rate limit exceeded": "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.",
  "invalid refresh token": "نشست شما منقضی شده است. دوباره وارد شوید.",
  "backend unavailable": "ارتباط با سرور برقرار نشد.",
  "backend request timed out": "پاسخ سرور بیش از حد طول کشید.",
  "referenced exam or subject not found": "آزمون یا درس انتخاب‌شده دیگر در دسترس نیست.",
  "exam not found": "آزمون موردنظر پیدا نشد.",
  "student not found": "دانش‌آموز موردنظر پیدا نشد.",
  "field not found": "فیلد سفارشی موردنظر پیدا نشد.",
  "post not found": "مقاله موردنظر پیدا نشد.",
  "performance record not found": "گزارش عملکرد موردنظر پیدا نشد.",
  "invalid jalali_date format": "تاریخ شمسی آزمون معتبر نیست.",
  "invalid jalali_birth_date format": "تاریخ تولد شمسی معتبر نیست.",
  "exam_date and jalali_date are mutually exclusive":
    "برای آزمون فقط یکی از تاریخ‌های شمسی یا میلادی قابل ارسال است.",
  "date and jalali_date are mutually exclusive":
    "برای گزارش فقط یکی از تاریخ‌های شمسی یا میلادی قابل ارسال است.",
  "birth_date and jalali_birth_date are mutually exclusive":
    "برای تولد فقط یکی از تاریخ‌های شمسی یا میلادی قابل ارسال است.",
  "invalid upload type. allowed: document, profile": "نوع مقصد آپلود معتبر نیست.",
};

/**
 * Resolves an HTTP status code and backend error body into a controlled
 * ErrorDescriptor that components and ApiError can safely display.
 * Raw backend strings are never surfaced directly to users.
 */
export function describeApiError(status: number, body: ApiErrorBody): ErrorDescriptor {
  const fallback = STATUS_ERRORS[status] ?? {
    code: "unknown" as const,
    message: "خطای پیش‌بینی‌نشده‌ای رخ داد.",
    retryable: status >= 500,
  };
  return {
    ...fallback,
    message: BACKEND_MESSAGES[body.error.toLowerCase()] ?? fallback.message,
  };
}
