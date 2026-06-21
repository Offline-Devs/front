import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:8080"),
  API_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(15_000),
  APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  PROFILE_UPLOAD_MAX_MB: z.coerce.number().positive().max(20).default(10),
  DOCUMENT_UPLOAD_MAX_MB: z.coerce.number().positive().max(100).default(50),
  MULTIPLE_UPLOAD_MAX_FILES: z.coerce.number().int().positive().max(10).default(10),
  BFF_SESSION_COOKIE_NAME: z.string().trim().min(1).default("noshirvani_session"),
  BFF_SESSION_COOKIE_DOMAIN: z.string().trim().default(""),
  BFF_SESSION_COOKIE_SECURE: z.enum(["auto", "true", "false"]).default("auto"),
  BFF_SESSION_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  BFF_SESSION_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(15 * 24 * 60 * 60),
  BFF_SESSION_SECRET: z.string().default(""),
});

// envهای محرمانه/داخلی فقط در سرور parse می‌شوند و در صورت مقدار نامعتبر fail-fast دارند.
const parsed = serverEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  PROFILE_UPLOAD_MAX_MB: process.env.PROFILE_UPLOAD_MAX_MB,
  DOCUMENT_UPLOAD_MAX_MB: process.env.DOCUMENT_UPLOAD_MAX_MB,
  MULTIPLE_UPLOAD_MAX_FILES: process.env.MULTIPLE_UPLOAD_MAX_FILES,
  BFF_SESSION_COOKIE_NAME: process.env.BFF_SESSION_COOKIE_NAME,
  BFF_SESSION_COOKIE_DOMAIN: process.env.BFF_SESSION_COOKIE_DOMAIN,
  BFF_SESSION_COOKIE_SECURE: process.env.BFF_SESSION_COOKIE_SECURE,
  BFF_SESSION_COOKIE_SAME_SITE: process.env.BFF_SESSION_COOKIE_SAME_SITE,
  BFF_SESSION_MAX_AGE_SECONDS: process.env.BFF_SESSION_MAX_AGE_SECONDS,
  BFF_SESSION_SECRET: process.env.BFF_SESSION_SECRET,
});

if (parsed.APP_ENV === "production" && parsed.BFF_SESSION_SECRET.length < 32) {
  throw new Error("BFF_SESSION_SECRET must contain at least 32 characters in production");
}

const sessionSecret = parsed.BFF_SESSION_SECRET || "development-only-session-secret-change-me";

export const serverEnv = {
  apiBaseUrl: parsed.API_BASE_URL.replace(/\/$/, ""),
  apiTimeoutMs: parsed.API_TIMEOUT_MS,
  appEnvironment: parsed.APP_ENV,
  logLevel: parsed.LOG_LEVEL,
  uploads: {
    profileMaxBytes: parsed.PROFILE_UPLOAD_MAX_MB * 1024 * 1024,
    documentMaxBytes: parsed.DOCUMENT_UPLOAD_MAX_MB * 1024 * 1024,
    maxFiles: parsed.MULTIPLE_UPLOAD_MAX_FILES,
  },
  session: {
    cookieName: parsed.BFF_SESSION_COOKIE_NAME,
    cookieDomain: parsed.BFF_SESSION_COOKIE_DOMAIN || undefined,
    cookieSecure: parsed.BFF_SESSION_COOKIE_SECURE === "auto" ? parsed.APP_ENV === "production" : parsed.BFF_SESSION_COOKIE_SECURE === "true",
    cookieSameSite: parsed.BFF_SESSION_COOKIE_SAME_SITE,
    maxAgeSeconds: parsed.BFF_SESSION_MAX_AGE_SECONDS,
    secret: sessionSecret,
  },
} as const;
