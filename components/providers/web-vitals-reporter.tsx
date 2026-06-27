/**
 * @file components/providers/web-vitals-reporter.tsx
 * @description Invisible client component that reports Core Web Vitals to the telemetry endpoint.
 *
 * Uses next/web-vitals' useReportWebVitals hook and filters to only the three
 * metrics that most directly reflect user experience: LCP, CLS, and INP.
 * Events are sanitised and sent via reportTelemetry() in lib/observability.ts
 * which uses navigator.sendBeacon for non-blocking delivery. Rendered once
 * inside AppProviders.
 */
"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportTelemetry } from "@/lib/observability";

const tracked = new Set(["LCP", "CLS", "INP"]);

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!tracked.has(metric.name)) return;
    reportTelemetry({
      type: "web-vital",
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      route: location.pathname,
    });
  });
  return null;
}
