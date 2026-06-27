/**
 * @file types/mistake.ts
 * @description TypeScript types for Mistake entities (the student error notebook).
 *
 * A Mistake may exist independently of any exam (exam_id is optional). When an
 * exam is selected in the form, only the exams and subject records owned by the
 * current student are presented for selection.
 *
 * MistakeInput / MistakeUpdateInput follow the same optional-id pattern: the
 * mutation payloads use undefined (not empty string) for absent relation IDs,
 * which the Zod schema enforces via its optionalId transform.
 */
import type { Exam, SubjectExam } from "./exam";
import type { DynamicValues, Student } from "./student";

// A mistake may exist without an exam. When an exam is selected, the form only exposes exams and subject records owned by the current student.
export type Mistake = {
  id: string;
  student_id: string;
  exam_id?: string;
  subject_exam_id?: string;
  question_number: number;
  category: string;
  notes: string;
  dynamic_fields: DynamicValues;
  created_at: string;
  updated_at: string;
  student?: Student;
  exam?: Exam;
  subject_exam?: SubjectExam;
};
export type MistakeInput = Pick<
  Mistake,
  "question_number" | "category" | "notes" | "dynamic_fields"
> & { exam_id?: string; subject_exam_id?: string };
export type MistakeUpdateInput = Partial<MistakeInput>;
