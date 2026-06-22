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
