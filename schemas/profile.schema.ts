import { z } from "zod";
import { normalizeNumericInput } from "@/lib/auth-flow";

const jalaliDate = z
  .string()
  .transform((value) => normalizeNumericInput(value.trim()).replace(/-/g, "/"))
  .refine((value) => /^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(value), {
    message: "تاریخ را با قالب ۱۴۰۰/۰۱/۰۱ وارد کنید.",
  })
  .refine((value) => {
    const [, month, day] = value.split("/").map(Number);
    return month <= 6 || day <= 30;
  }, "روز واردشده برای این ماه معتبر نیست.");

export const profileSchema = z.object({
  first_name: z.string().trim().min(2, "نام باید حداقل ۲ نویسه باشد."),
  last_name: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ نویسه باشد."),
  city: z.string().trim().min(2, "شهر را وارد کنید."),
  jalali_birth_date: jalaliDate,
  school: z.string().trim().min(2, "نام مدرسه را وارد کنید."),
  major: z.string().trim().min(1, "رشته تحصیلی را انتخاب کنید."),
  profile_photo: z.string(),
  dynamic_fields: z.record(z.string(), z.unknown()),
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileFormOutput = z.output<typeof profileSchema>;
