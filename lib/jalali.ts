/**
 * @file lib/jalali.ts
 * @description Jalali (Solar Hijri) date string normalisation utility.
 *
 * normalizeJalaliDate(value) — pads year, month, and day components of a
 *   YYYY/MM/DD string to their canonical zero-padded form (e.g. "1400/1/5"
 *   → "1400/01/05"). The backend stores and compares Jalali date strings
 *   lexicographically, so consistent zero-padding is required for range
 *   filtering to work correctly.
 *
 * Throws an Error on malformed input (wrong segment count or non-numeric parts).
 * Used by the exam and performance response mappers.
 */
// Backend Jalali dates must use zero-padded YYYY/MM/DD strings because date-range handlers compare these values lexicographically.
export function normalizeJalaliDate(value: string) {
  const parts = value.split("/").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) throw new Error("تاریخ جلالی نامعتبر است");
  return `${String(parts[0]).padStart(4, "0")}/${String(parts[1]).padStart(2, "0")}/${String(parts[2]).padStart(2, "0")}`;
}
