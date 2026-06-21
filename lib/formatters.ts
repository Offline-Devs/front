import { env } from "@/config/env";

// Central Persian number, date, and file-size formatters keep locale behavior consistent across public, student, and administrator views.
export const formatNumber = (value: number) => new Intl.NumberFormat(env.locale).format(value);
export const formatDate = (value: string | Date) => new Intl.DateTimeFormat(env.locale, { dateStyle: "medium", timeZone: env.timeZone }).format(new Date(value));
export const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
