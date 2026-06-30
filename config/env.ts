/**
 * @file config/env.ts
 * @description Public (NEXT_PUBLIC_*) environment variable schema and typed export.
 *
 * Uses Zod to validate every public env var at module load time. Invalid or missing
 * required variables cause an immediate schema parse error that surfaces as a build
 * or runtime error with a clear message — no silent undefined misses.
 *
 * Each variable is referenced by its explicit process.env.NEXT_PUBLIC_* name because
 * Next.js performs compile-time string replacement only for statically-referenced
 * NEXT_PUBLIC keys; dynamic access like process.env[key] is not replaced.
 *
 * The exported `env` object is safe to import in both client and server components.
 * It never contains secrets — all secret configuration lives in config/server-env.ts.
 */
import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]);
const booleanString = z.enum(["true", "false"]).transform((value) => value === "true");

function envValue(name: string, fallback: string) {
  return process.env[name]?.trim() || fallback;
}

const publicEnvSchema = z.object({
  appName: z.string().trim().min(1),
  appShortName: z.string().trim().min(1),
  appDescription: z.string().trim().min(1),
  appVersion: z.string().trim().min(1),
  siteUrl: z.string().url(),
  apiBasePath: z
    .string()
    .startsWith("/")
    .refine((value) => !value.endsWith("/"), "مسیر API نباید slash انتهایی داشته باشد"),
  locale: z.string().trim().min(2),
  timeZone: z.string().trim().min(1),
  supportEmail: z.string().email(),
  supportPhone: z.string().trim().min(1),
  instagramUrl: optionalUrl,
  telegramUrl: optionalUrl,
  queryStaleTimeMs: z.coerce.number().int().nonnegative(),
  queryGcTimeMs: z.coerce.number().int().positive(),
  queryRetryCount: z.coerce.number().int().min(0).max(5),
  queryRefetchOnWindowFocus: booleanString,
  otpResendSeconds: z.coerce.number().int().positive(),
  defaultPageSize: z.coerce.number().int().min(1).max(100),
  profileUploadMaxMb: z.coerce.number().positive(),
  documentUploadMaxMb: z.coerce.number().positive(),
  multipleUploadMaxFiles: z.coerce.number().int().min(1).max(10),
  enableBlog: booleanString,
  enableContactPage: booleanString,
});

// Each public variable is accessed explicitly because Next.js performs compile-time replacement only for statically referenced NEXT_PUBLIC keys. These values are configuration, never secrets.
export const env = publicEnvSchema.parse({
  appName: envValue("NEXT_PUBLIC_APP_NAME", "آینده سبز"),
  appShortName: envValue("NEXT_PUBLIC_APP_SHORT_NAME", "آینده سبز"),
  appDescription: envValue(
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "پلتفرم تحلیل عملکرد درسی دانش آموزان کنکوری",
  ),
  appVersion: envValue("NEXT_PUBLIC_APP_VERSION", "0.1.0"),
  siteUrl: envValue("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  apiBasePath: envValue("NEXT_PUBLIC_API_BASE_PATH", "/api/v1"),
  locale: envValue("NEXT_PUBLIC_LOCALE", "fa-IR"),
  timeZone: envValue("NEXT_PUBLIC_TIME_ZONE", "Asia/Tehran"),
  supportEmail: envValue("NEXT_PUBLIC_SUPPORT_EMAIL", "support@example.com"),
  supportPhone: envValue("NEXT_PUBLIC_SUPPORT_PHONE", "+980000000000"),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
  queryStaleTimeMs: envValue("NEXT_PUBLIC_QUERY_STALE_TIME_MS", "60000"),
  queryGcTimeMs: envValue("NEXT_PUBLIC_QUERY_GC_TIME_MS", "600000"),
  queryRetryCount: envValue("NEXT_PUBLIC_QUERY_RETRY_COUNT", "1"),
  queryRefetchOnWindowFocus: envValue("NEXT_PUBLIC_QUERY_REFETCH_ON_WINDOW_FOCUS", "false"),
  otpResendSeconds: envValue("NEXT_PUBLIC_OTP_RESEND_SECONDS", "120"),
  defaultPageSize: envValue("NEXT_PUBLIC_DEFAULT_PAGE_SIZE", "20"),
  profileUploadMaxMb: envValue("NEXT_PUBLIC_PROFILE_UPLOAD_MAX_MB", "10"),
  documentUploadMaxMb: envValue("NEXT_PUBLIC_DOCUMENT_UPLOAD_MAX_MB", "50"),
  multipleUploadMaxFiles: envValue("NEXT_PUBLIC_MULTIPLE_UPLOAD_MAX_FILES", "10"),
  enableBlog: envValue("NEXT_PUBLIC_ENABLE_BLOG", "true"),
  enableContactPage: envValue("NEXT_PUBLIC_ENABLE_CONTACT_PAGE", "true"),
});
