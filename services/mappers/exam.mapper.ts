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
  return { ...value, jalali_date: safeDate(value.jalali_date), subjects: value.subjects ?? [] };
}
export const mapExamList = (values: Exam[]) => values.map(mapExam);
