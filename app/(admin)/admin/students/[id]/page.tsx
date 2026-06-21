import type { Metadata } from "next";
import { StudentOverview } from "@/components/admin/student-overview";
export const metadata: Metadata = { title: "پرونده دانش‌آموز" };
export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <StudentOverview studentId={id} />; }
