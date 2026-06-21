"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { env } from "@/config/env";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionBootstrap } from "@/components/auth/session-bootstrap";
import { OfflineBanner } from "@/components/shared/offline-banner";

// مرز providerهای کلاینت؛ QueryClient برای هر نشست مرورگر فقط یک بار ساخته می‌شود.
export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}><SessionBootstrap /><OfflineBanner /><TooltipProvider delayDuration={300}>{children}<Toaster /></TooltipProvider>{env.enableQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}</QueryClientProvider>;
}
