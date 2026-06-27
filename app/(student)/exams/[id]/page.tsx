/**
 * @file app/(student)/exams/[id]/page.tsx
 * @description Exam detail page showing per-subject score breakdown.
 *
 * Resolves the [id] param and renders ExamSummary which fetches the
 * individual exam (with mapped subject percentages) and displays it as
 * per-subject score cards.
 */
import { ExamSummary } from "@/components/exams/exam-summary";
export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamSummary id={id} />;
}
