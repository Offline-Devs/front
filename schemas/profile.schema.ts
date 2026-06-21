import { z } from "zod";
// schema فرم پروفایل؛ dynamic fields بعد از دریافت definitionها به‌صورت runtime تکمیل می‌شود.
export const profileSchema = z.object({ first_name: z.string().trim().min(1), last_name: z.string().trim().min(1), city: z.string(), jalali_birth_date: z.string(), school: z.string(), major: z.string(), profile_photo: z.string(), dynamic_fields: z.record(z.string(), z.unknown()) });
