// تاریخ ارسالی به بک‌اند باید دقیقاً YYYY/MM/DD و zero-padded باشد تا فیلتر lexicographic خراب نشود.
export function normalizeJalaliDate(value: string) {
  const parts = value.split("/").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) throw new Error("تاریخ جلالی نامعتبر است");
  return `${String(parts[0]).padStart(4, "0")}/${String(parts[1]).padStart(2, "0")}/${String(parts[2]).padStart(2, "0")}`;
}
