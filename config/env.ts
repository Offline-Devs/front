import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]);
const booleanString = z.enum(["true", "false"]).transform((value) => value === "true");

const publicEnvSchema = z.object({
  appName: z.string().trim().min(1),
  appShortName: z.string().trim().min(1),
  appDescription: z.string().trim().min(1),
  appVersion: z.string().trim().min(1),
  siteUrl: z.string().url(),
  apiBasePath: z.string().startsWith("/").refine((value) => !value.endsWith("/"), "مسیر API نباید slash انتهایی داشته باشد"),
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
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "آکادمی نوشیروانی",
  appShortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME ?? "نوشیروانی",
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "سامانه مدیریت آزمون و مشاوره تحصیلی آکادمی نوشیروانی",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api/v1",
  locale: process.env.NEXT_PUBLIC_LOCALE ?? "fa-IR",
  timeZone: process.env.NEXT_PUBLIC_TIME_ZONE ?? "Asia/Tehran",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@noshirvaniacademy.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+981112345678",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
  queryStaleTimeMs: process.env.NEXT_PUBLIC_QUERY_STALE_TIME_MS ?? "60000",
  queryGcTimeMs: process.env.NEXT_PUBLIC_QUERY_GC_TIME_MS ?? "600000",
  queryRetryCount: process.env.NEXT_PUBLIC_QUERY_RETRY_COUNT ?? "1",
  queryRefetchOnWindowFocus: process.env.NEXT_PUBLIC_QUERY_REFETCH_ON_WINDOW_FOCUS ?? "false",
  otpResendSeconds: process.env.NEXT_PUBLIC_OTP_RESEND_SECONDS ?? "120",
  defaultPageSize: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE ?? "20",
  profileUploadMaxMb: process.env.NEXT_PUBLIC_PROFILE_UPLOAD_MAX_MB ?? "10",
  documentUploadMaxMb: process.env.NEXT_PUBLIC_DOCUMENT_UPLOAD_MAX_MB ?? "50",
  multipleUploadMaxFiles: process.env.NEXT_PUBLIC_MULTIPLE_UPLOAD_MAX_FILES ?? "10",
  enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG ?? "true",
  enableContactPage: process.env.NEXT_PUBLIC_ENABLE_CONTACT_PAGE ?? "true",
});
