import { PagePlaceholder } from "@/components/shared/page-placeholder";
// نمای 360 درجه دانش‌آموز: profile، exams، mistakes، performance و statistics.
export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PagePlaceholder title="پرونده دانش‌آموز" description={id} />; }
