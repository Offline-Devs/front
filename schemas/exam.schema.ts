import { z } from "zod";
// invariantهای آزمون؛ answered/correct/wrong/blank باید با total_questions سازگار باشند.
export const subjectExamSchema = z.object({ subject_name: z.string().min(1), total_questions: z.number().int().nonnegative(), answered: z.number().int().nonnegative(), correct: z.number().int().nonnegative(), wrong: z.number().int().nonnegative(), blank: z.number().int().nonnegative() });
export const examSchema = z.object({ title: z.string().min(1), jalali_date: z.string(), major: z.string().min(1), subjects: z.array(subjectExamSchema).min(1), dynamic_fields: z.record(z.string(), z.unknown()) });
