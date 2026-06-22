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
    })),
  };
}
export const mapExamList = (values: Exam[]) => values.map(mapExam);
