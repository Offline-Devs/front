/**
 * @file schemas/mistake.schema.ts
 * @description Zod validation schema for mistake notebook entry form inputs.
 *
 * Uses an optionalId transform that converts empty strings to undefined and
 * then validates as UUID or undefined — this maps cleanly to the backend's
 * optional UUID foreign keys (exam_id, subject_exam_id).
 *
 * A superRefine rule ensures subject_exam_id cannot be set without exam_id.
 */
import { z } from "zod";
const optionalId = z
  .string()
  .transform((value) => value || undefined)
  .pipe(z.string().uuid().optional());
export const mistakeSchema = z
  .object({
    exam_id: optionalId,
    subject_exam_id: optionalId,
    question_number: z
      .number()
      .int("عدد صحیح وارد کنید.")
      .positive("شماره سؤال باید بیشتر از صفر باشد."),
    category: z.string().trim().min(2, "دسته‌بندی اشتباه را وارد کنید."),
    notes: z.string().trim(),
    dynamic_fields: z.record(z.string(), z.unknown()),
  })
  .superRefine((value, context) => {
    if (value.subject_exam_id && !value.exam_id)
      context.addIssue({
        code: "custom",
        path: ["subject_exam_id"],
        message: "برای انتخاب درس باید آزمون مشخص باشد.",
      });
  });
export type MistakeFormValues = z.input<typeof mistakeSchema>;
export type MistakeFormOutput = z.output<typeof mistakeSchema>;
