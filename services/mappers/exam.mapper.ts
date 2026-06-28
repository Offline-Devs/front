/**
 * @file services/mappers/exam.mapper.ts
 * @description Normalises raw Exam API responses before they reach UI components.
 *
 * mapExam(value) — applies three transformations:
 *  1. Clamps negative_mark to 0 for non-finite backend values.
 *  2. Zero-pads the Jalali date to the canonical YYYY/MM/DD form expected by
 *     date comparison and display logic.
 *  3. Calculates each subject's percentage:
 *       (correct - wrong × negative_mark) / total_questions × 100
 *     The backend stores raw counts; percentage is a UI-only derived value.
 *
 * mapExamList — maps an array of exams through mapExam.
 */
import { normalizeJalaliDate } from "@/lib/jalali";
import type { Exam } from "@/types/exam";

function safeDate(value: string) {
  try {
    return normalizeJalaliDate(value);
  } catch {
    return value;
  }
}
export function mapExam(value: Exam): Exam {
  const negativeMark = Number.isFinite(value.negative_mark) ? value.negative_mark : 0;
  return {
    ...value,
    negative_mark: negativeMark,
    jalali_date: safeDate(value.jalali_date),
    subjects: (value.subjects ?? []).map((subject) => ({
      ...subject,
      percentage:
        subject.total_questions > 0
          ? ((subject.correct - subject.wrong * negativeMark) / subject.total_questions) * 100
          : 0,
    })) as Exam["subjects"],
  };
}
export const mapExamList = (values: Exam[]) => values.map(mapExam);
