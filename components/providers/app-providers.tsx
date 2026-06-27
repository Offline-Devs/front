/**
 * @file components/providers/app-providers.tsx
 * @description Root client-side provider tree for the entire application.
 *
 * This is the ONLY global client boundary. All browser-only context providers
 * live here so that the root layout and all route segments default to
 * server-rendered React by default.
 *
 * Providers (in render order):
 *   QueryClientProvider — single TanStack Query client created once per browser
 *     session via useState(createQueryClient). Prevents cache leaks between
 *     server requests.
 *   WebVitalsReporter  — reports Core Web Vitals to the telemetry endpoint.
 *   SessionBootstrap   — fetches the BFF session on mount, populates the auth
 *     store, and subscribes to cross-tab auth events.
 *   OfflineBanner      — monitors navigator.onLine and shows a banner when
 *     the device loses network connectivity.
 *   Toaster            — Sonner toast container for global notifications.
 */
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
