import { PagePlaceholder } from "@/components/shared/page-placeholder";
// فرم مدیر برای ثبت برنامه مطالعاتی، گزارش، تاریخ و فایل‌های پیوست.
export default async function NewPerformancePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PagePlaceholder title="ثبت گزارش عملکرد" description={id} />; }
