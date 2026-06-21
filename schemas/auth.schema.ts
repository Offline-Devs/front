import { z } from "zod";
// اعتبارسنجی شماره ایران و OTP؛ backend فقط required را بررسی می‌کند، پس سخت‌گیری UX اینجاست.
export const phoneSchema = z.object({ phone: z.string().regex(/^\+989\d{9}$/, "شماره باید با +989 شروع شود") });
export const otpSchema = phoneSchema.extend({ code: z.string().regex(/^\d{6}$/, "کد باید ۶ رقم باشد") });
