/**
 * @file app/(admin)/admin/students/[id]/performance/new/page.tsx
 * @description Page for creating a new performance report for a student.
 *
 * Resolves the [id] param and renders PerformanceForm in create mode.
 * The admin fills in the report date, study plan, advisor notes, and
 * file-attachment URLs. On save the form navigates back to the student
 * detail page and invalidates the performance query cache reactively.
 */
import type { Metadata } from "next";
import { PerformanceForm } from "@/components/performance/performance-form";
export const metadata: Metadata = { title: "ثبت گزارش عملکرد" };
export default async function NewPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">ثبت گزارش عملکرد</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          برنامه مطالعاتی، یادداشت مشاور و فایل‌های همراه را ثبت کنید.
        </p>
      </div>
      <PerformanceForm studentId={id} />
    </div>
  );
}
