/**
 * @file app/(student)/exams/[id]/edit/page.tsx
 * @description Page for editing an existing exam entry.
 *
 * Server component. Fetches the exam directly from the backend (bypassing
 * the client cache so edits always start from authoritative data), maps it
 * through the exam mapper, and passes it to ExamForm in edit mode. Returns
 * notFound() for a 404 response.
 */
import { notFound } from "next/navigation";
import { ExamForm } from "@/components/exams/exam-form";
import { backendFetch } from "@/lib/server/backend-client";
import { readSession } from "@/lib/server/session";
import { mapExam } from "@/services/mappers/exam.mapper";
import type { Exam } from "@/types/exam";
export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  if (!session) return null;
  const response = await backendFetch(`/exams/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("دریافت آزمون برای ویرایش ناموفق بود.");
  const exam = mapExam((await response.json()) as Exam);
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">ویرایش آزمون</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          اطلاعات و همه درس‌های آزمون را بازبینی کنید.
        </p>
      </div>
      <ExamForm exam={exam} />
    </div>
  );
}
