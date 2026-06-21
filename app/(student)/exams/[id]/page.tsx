import { PagePlaceholder } from "@/components/shared/page-placeholder";
// جزئیات و درصد هر درس از GET /exams/:id.
export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PagePlaceholder title="جزئیات آزمون" description={`شناسه آزمون: ${id}`} />; }
