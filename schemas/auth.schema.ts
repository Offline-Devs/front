import { z } from "zod";
import { normalizeIranianPhone, normalizeNumericInput } from "@/lib/auth-flow";

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "شماره موبایل را وارد کنید.")
    .transform(normalizeIranianPhone)
    .refine((value) => /^\+989\d{9}$/.test(value), {
      message: "شماره موبایل معتبر نیست.",
    }),
});

export const otpSchema = phoneSchema.extend({
  code: z
    .string()
    .transform(normalizeNumericInput)
    .refine((value) => /^\d{6}$/.test(value), {
      message: "کد تأیید باید ۶ رقم باشد.",
    }),
});

export type PhoneFormValues = z.input<typeof phoneSchema>;
export type PhoneFormOutput = z.output<typeof phoneSchema>;
export type OtpFormValues = z.input<typeof otpSchema>;
export type OtpFormOutput = z.output<typeof otpSchema>;
