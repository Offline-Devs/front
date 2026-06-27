/**
 * @file lib/statistics.ts
 * @description Utility functions for the statistics filter UI.
 *
 * normalizeStatisticsDate(value) — strips whitespace, converts Persian/Arabic
 *   digits, and replaces hyphens with slashes so the date filter inputs accept
 *   both YYYY/MM/DD and YYYY-MM-DD input styles.
 *
 * validateStatisticsRange(from, to) — validates that both values match the
 *   1[34]xx/mm/dd Jalali pattern and that from ≤ to. Returns an error string
 *   or null.
 *
 * totalCategorizedMistakes(reasons) — sums all values in a mistakes-by-reason
 *   record for display in the statistics summary card.
 */
import { normalizeNumericInput } from "./auth-flow";

export function normalizeStatisticsDate(value: string) {
  return normalizeNumericInput(value.trim()).replace(/-/g, "/");
}

export function validateStatisticsRange(from: string, to: string) {
  const pattern = /^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;
  if ((from && !pattern.test(from)) || (to && !pattern.test(to)))
    return "تاریخ‌ها را با قالب ۱۴۰۰/۰۱/۰۱ وارد کنید.";
  if (from && to && from > to) return "تاریخ شروع نباید بعد از تاریخ پایان باشد.";
  return null;
}

export function totalCategorizedMistakes(reasons: Record<string, number>) {
  return Object.values(reasons).reduce((sum, value) => sum + value, 0);
}
