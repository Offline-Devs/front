import { env } from "@/config/env";

// URL نسبی /uploads بک‌اند را از gateway هم‌مبدا عبور می‌دهد؛ URL مطلق معتبر بدون تغییر می‌ماند.
export function resolveUploadUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${env.apiBasePath}${normalized}`;
}
