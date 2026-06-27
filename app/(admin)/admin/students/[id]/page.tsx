/**
 * @file app/(admin)/admin/students/[id]/page.tsx
 * @description Admin student detail page.
 *
 * Resolves the dynamic [id] param and passes studentId to StudentOverview,
 * a client component that fetches and displays the student's profile,
 * exams, mistakes, statistics, and performance reports via tabbed sections.
 */
import type { Metadata } from "next";
import { StudentOverview } from "@/components/admin/student-overview";
export const metadata: Metadata = { title: "پرونده دانش‌آموز" };
export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentOverview studentId={id} />;
}
