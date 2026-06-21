"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { reportTelemetry } from "@/lib/observability";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportTelemetry({ type: "error", name: error.name || "global_error", digest: error.digest, route: location.pathname }); }, [error]);
  return <html lang="fa" dir="rtl"><body><main className="grid min-h-screen place-items-center p-6"><div role="alert" className="grid max-w-md justify-items-center gap-4 text-center"><h1 className="text-2xl font-black">خطای جدی در برنامه</h1><p className="leading-7 text-muted-foreground">نمایش این صفحه ممکن نشد. دوباره تلاش کنید.</p><Button onClick={reset}>تلاش دوباره</Button></div></main></body></html>;
}
