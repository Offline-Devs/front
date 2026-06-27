/**
 * @file lib/formatters.ts
 * @description Locale-aware number, date, and file-size formatters.
 *
 * All formatters use the locale and time zone configured in config/env.ts
 * (default: fa-IR / Asia/Tehran) so the same presentation layer is used
 * across public, student, and admin views.
 *
 * formatNumber(value)   — Intl.NumberFormat with fa-IR grouping and digits.
 * formatDate(value)     — Intl.DateTimeFormat with dateStyle: "medium".
 * formatFileSize(bytes) — converts bytes to a human-readable MB string.
 */
import { env } from "@/config/env";

// Central Persian number, date, and file-size formatters keep locale behavior consistent across public, student, and administrator views.
export const formatNumber = (value: number) => new Intl.NumberFormat(env.locale).format(value);
export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat(env.locale, { dateStyle: "medium", timeZone: env.timeZone }).format(
    new Date(value),
  );
export const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
