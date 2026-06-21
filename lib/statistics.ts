import { normalizeNumericInput } from "./auth-flow";

export function normalizeStatisticsDate(value: string) {
  return normalizeNumericInput(value.trim()).replace(/-/g, "/");
}

export function validateStatisticsRange(from: string, to: string) {
  const pattern = /^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;
  if ((from && !pattern.test(from)) || (to && !pattern.test(to))) return "تاریخ‌ها را با قالب ۱۴۰۰/۰۱/۰۱ وارد کنید.";
  if (from && to && from > to) return "تاریخ شروع نباید بعد از تاریخ پایان باشد.";
  return null;
}

export function totalCategorizedMistakes(reasons: Record<string, number>) {
  return Object.values(reasons).reduce((sum, value) => sum + value, 0);
}
