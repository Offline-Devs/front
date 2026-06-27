/**
 * @file types/exam.ts
 * @description TypeScript types for Exam and SubjectExam entities.
 *
 * SubjectExam includes backend-generated id, exam_id, and percentage fields.
 * ExamInput and SubjectExamInput omit those read-only properties so mutation
 * payloads don't accidentally send server-computed values back to the backend.
 *
 * Note on PUT semantics: the backend's UpdateExam endpoint replaces the entire
 * subject collection when subjects are provided. ExamForm always submits the
 * complete list of retained subjects when editing, not just changed rows.
 */
import type { DynamicValues } from "./student";

// SubjectExam includes backend-generated identifiers and calculated fields. Create mappers deliberately omit those read-only properties from mutation payloads.
export type SubjectExam = {
  id: string;
  exam_id: string;
  subject_name: string;
  total_questions: number;
  answered: number;
  correct: number;
  wrong: number;
  blank: number;
  percentage: number;
};
export type Exam = {
  id: string;
  student_id: string;
  title: string;
  exam_date: string;
  jalali_date: string;
  major: string;
  negative_mark: number;
  total_subjects: number;
  dynamic_fields: DynamicValues;
  created_at: string;
  updated_at: string;
  subjects?: SubjectExam[];
};
export type SubjectExamInput = Omit<SubjectExam, "id" | "exam_id" | "percentage">;
export type ExamInput = {
  title: string;
  jalali_date: string;
  major: string;
  negative_mark: number;
  total_subjects: number;
  dynamic_fields: DynamicValues;
  subjects: SubjectExamInput[];
};
export type ExamUpdateInput = Partial<ExamInput>;
