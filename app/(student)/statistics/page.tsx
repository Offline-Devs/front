/**
 * @file app/(student)/statistics/page.tsx
 * @description Student exam statistics and analysis page.
 *
 * Renders StatisticsDashboard wrapped in a Suspense boundary (skeleton
 * fallback). The dashboard supports optional Jalali date range filters
 * synced to URL query params and displays trend, subject-accuracy, and
 * mistake-category charts.
 */
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
