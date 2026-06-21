"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { createQueryClient } from "@/lib/query-client";
import { env } from "@/config/env";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionBootstrap } from "@/components/auth/session-bootstrap";
import { OfflineBanner } from "@/components/shared/offline-banner";
import { WebVitalsReporter } from "./web-vitals-reporter";

const QueryDevtools = dynamic(() => import("@tanstack/react-query-devtools").then((module) => module.ReactQueryDevtools), { ssr: false });

// مرز providerهای کلاینت؛ QueryClient برای هر نشست مرورگر فقط یک بار ساخته می‌شود.
export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}><WebVitalsReporter /><SessionBootstrap /><OfflineBanner /><TooltipProvider delayDuration={300}>{children}<Toaster /></TooltipProvider>{env.appEnvironment !== "production" && env.enableQueryDevtools && <QueryDevtools initialIsOpen={false} />}</QueryClientProvider>;
}
