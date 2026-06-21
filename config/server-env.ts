import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:8080"),
  API_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(15_000),
});

// envهای محرمانه/داخلی فقط در سرور parse می‌شوند و در صورت مقدار نامعتبر fail-fast دارند.
const parsed = serverEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
});

export const serverEnv = {
  apiBaseUrl: parsed.API_BASE_URL.replace(/\/$/, ""),
  apiTimeoutMs: parsed.API_TIMEOUT_MS,
} as const;
