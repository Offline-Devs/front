import { z } from "zod";
// فرم گزارش مدیر؛ files پیش از ارسال JSON.stringify می‌شود.
export const performanceSchema = z.object({ jalali_date: z.string(), notes: z.string(), study_plan: z.string(), files: z.array(z.string()) });
