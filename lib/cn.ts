import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ترکیب امن کلاس‌های شرطی Tailwind برای componentهای UI.
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
