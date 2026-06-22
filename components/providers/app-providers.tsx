"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/toast";
import { SessionBootstrap } from "@/components/auth/session-bootstrap";
import { OfflineBanner } from "@/components/shared/offline-banner";
import { WebVitalsReporter } from "./web-vitals-reporter";

// This is the only global client boundary. A single QueryClient instance is created per browser session so cache state remains stable across route transitions without leaking between server requests.
export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <WebVitalsReporter />
      <SessionBootstrap />
      <OfflineBanner />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
