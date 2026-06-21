import { PagePlaceholder } from "@/components/shared/page-placeholder";
// ویرایش کامل آزمون؛ هشدار داده شود که backend لیست درس‌ها را merge نمی‌کند و replace می‌کند.
export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PagePlaceholder title="ویرایش آزمون" description={id} />; }
