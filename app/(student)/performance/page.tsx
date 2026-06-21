import type { Metadata } from "next";
import { PerformanceTimeline } from "@/components/performance/performance-timeline";
export const metadata: Metadata = { title: "برنامه و گزارش عملکرد" };
export default function PerformancePage() { return <div className="grid gap-6"><div><h1 className="text-2xl font-black">برنامه و گزارش عملکرد</h1><p className="mt-2 text-sm text-muted-foreground">برنامه‌های مطالعاتی، یادداشت‌های مشاور و فایل‌های همراه را مرور کنید.</p></div><PerformanceTimeline /></div>; }
