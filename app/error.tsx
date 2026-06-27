/**
 * @file app/error.tsx
 * @description Root Next.js error boundary component.
 *
 * Rendered automatically by Next.js when an unhandled error is thrown
 * inside a route segment. Displays a user-facing error message with a
 * "Try again" reset button that calls the provided reset() callback to
 * attempt recovery without a full page reload.
 */
"use client";

import { useEffect } from "react";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { Button } from "@/components/ui/button";
import { reportTelemetry } from "@/lib/observability";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportTelemetry({
      type: "error",
      name: error.name || "render_error",
      digest: error.digest,
      route: location.pathname,
    });
  }, [error]);
  return (
    <main className="page-container py-6">
      <PageBreadcrumbs currentLabel="خطای صفحه" className="mb-12 border-b pb-4" />
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div className="grid justify-items-center gap-4">
          <h1 className="text-2xl font-black">خطایی رخ داد</h1>
          <Button onClick={reset}>تلاش دوباره</Button>
        </div>
      </div>
    </main>
  );
}
