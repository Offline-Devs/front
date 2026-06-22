import { z } from "zod";
import { normalizeNumericInput } from "@/lib/auth-flow";

const count = z.number().int("عدد صحیح وارد کنید.").min(0, "مقدار منفی مجاز نیست.");

const subjectExamSchema = z
  .object({
    subject_name: z.string().trim().min(1, "درس را انتخاب کنید."),
    total_questions: count,
    answered: count,
    correct: count,
    wrong: count,
    blank: count,
  })
  .superRefine((value, context) => {
    if (value.correct + value.wrong !== value.answered) {
      context.addIssue({
        code: "custom",
        path: ["answered"],
        message: "پاسخ‌داده‌شده باید برابر صحیح + غلط باشد.",
      });
    }
    if (value.answered + value.blank !== value.total_questions) {
      context.addIssue({
        code: "custom",
        path: ["total_questions"],
        message: "مجموع پاسخ‌داده‌شده و نزده با تعداد سؤال برابر نیست.",
      });
    }
  });

export const examSchema = z
  .object({
    title: z.string().trim().min(2, "عنوان آزمون را وارد کنید."),
    jalali_date: z
      .string()
      .transform((value) => normalizeNumericInput(value).replace(/-/g, "/"))
      .refine(
        (value) => /^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(value),
        "تاریخ معتبر با قالب ۱۴۰۰/۰۱/۰۱ وارد کنید.",
      ),
    subjects: z.array(subjectExamSchema).min(1, "حداقل یک درس اضافه کنید."),
    dynamic_fields: z.record(z.string(), z.unknown()),
  })
  .superRefine((value, context) => {
    const names = value.subjects.map((subject) => subject.subject_name);
    if (new Set(names).size !== names.length) {
      context.addIssue({
        code: "custom",
        path: ["subjects"],
        message: "هر درس فقط یک بار قابل ثبت است.",
      });
    }
  });

export type ExamFormValues = z.input<typeof examSchema>;
export type ExamFormOutput = z.output<typeof examSchema>;
