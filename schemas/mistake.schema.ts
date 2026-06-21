import { z } from "zod";
// backend question_number <= 0 را رد می‌کند؛ شناسه آزمون/درس اختیاری است.
export const mistakeSchema = z.object({ exam_id: z.string().uuid().optional(), subject_exam_id: z.string().uuid().optional(), question_number: z.number().int().positive(), category: z.string(), notes: z.string(), dynamic_fields: z.record(z.string(), z.unknown()) });
