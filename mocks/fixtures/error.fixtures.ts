import type { ApiErrorBody } from "@/types/api";

// خطاهای واقعی handlerها برای پوشش UI و تست catalog پیام فارسی.
export const errorFixtures = {
  invalidPayload: { status: 400, body: { error: "invalid payload" } },
  invalidOtp: { status: 401, body: { error: "invalid or expired otp" } },
  inactiveUser: { status: 403, body: { error: "user is inactive" } },
  missingProfile: { status: 404, body: { error: "student profile not found" } },
  rateLimited: { status: 429, body: { error: "rate limit exceeded" } },
  serverError: { status: 500, body: { error: "failed to load data" } },
  unavailable: { status: 502, body: { error: "backend unavailable" } },
  timeout: { status: 504, body: { error: "backend request timed out" } },
} as const satisfies Record<string, { status: number; body: ApiErrorBody }>;
