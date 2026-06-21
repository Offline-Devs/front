// فرمت‌کننده‌های متمرکز اعداد، تاریخ و حجم فایل برای جلوگیری از خروجی ناسازگار در صفحات.
export const formatNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
export const formatDate = (value: string | Date) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
export const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
