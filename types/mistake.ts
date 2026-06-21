import type { Exam, SubjectExam } from "./exam";
import type { DynamicValues, Student } from "./student";

// اشتباه می‌تواند مستقل از آزمون باشد؛ قبل از ارسال، مالکیت exam در UI محدود شود.
export type Mistake = { id: string; student_id: string; exam_id?: string; subject_exam_id?: string; question_number: number; category: string; notes: string; dynamic_fields: DynamicValues; created_at: string; updated_at: string; student?: Student; exam?: Exam; subject_exam?: SubjectExam };
export type MistakeInput = Pick<Mistake, "question_number" | "category" | "notes" | "dynamic_fields"> & { exam_id?: string; subject_exam_id?: string };
export type MistakeUpdateInput = Partial<MistakeInput>;
