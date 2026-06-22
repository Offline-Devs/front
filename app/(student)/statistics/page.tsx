import type { Metadata } from "next";
import { Suspense } from "react";
import { StatisticsDashboard } from "@/components/statistics/statistics-dashboard";
export const metadata: Metadata = { title: "آمار و تحلیل" };
export default function StatisticsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">آمار و تحلیل</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          روند آزمون‌ها، عملکرد درس‌ها و الگوی اشتباهات را بررسی کنید.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <StatisticsDashboard />
      </Suspense>
    </div>
  );
}
