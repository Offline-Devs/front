import { ExamSummary } from "@/components/exams/exam-summary";
export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamSummary id={id} />;
}
