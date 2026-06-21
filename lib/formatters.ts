import { env } from "@/config/env";

// فرمت‌کننده‌های متمرکز اعداد، تاریخ و حجم فایل برای جلوگیری از خروجی ناسازگار در صفحات.
export const formatNumber = (value: number) => new Intl.NumberFormat(env.locale).format(value);
export const formatDate = (value: string | Date) => new Intl.DateTimeFormat(env.locale, { dateStyle: "medium", timeZone: env.timeZone }).format(new Date(value));
export const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
