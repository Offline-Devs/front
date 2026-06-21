"use client";

import { useEffect } from "react";
import { reportTelemetry } from "@/lib/observability";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportTelemetry({ type: "error", name: error.name || "render_error", digest: error.digest, route: location.pathname }); }, [error]);
  return <main className="p-8 text-center"><p>خطایی رخ داد.</p><button className="mt-4" onClick={reset}>تلاش دوباره</button></main>;
}
