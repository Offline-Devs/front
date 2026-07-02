/**
 * @file lib/query-client.ts
 * @description TanStack Query client factory with global error and success handling.
 *
 * createQueryClient() — called once per browser session in AppProviders. Configures:
 *
 *   MutationCache.onSuccess — shows a success toast when mutation.meta.successMessage
 *     is set. Components opt in by providing the meta property.
 *   MutationCache.onError   — shows an error toast with the Persian error message
 *     from ApiError or a generic fallback.
 *   QueryCache.onError      — shows an error toast for queries whose first fetch
 *     fails, unless query.meta.suppressErrorToast is true (used by session and
 *     approval guard queries that handle their own error UI).
 *
 *   Default query options:
 *     staleTime / gcTime    — driven by NEXT_PUBLIC_QUERY_* env vars.
 *     retry                 — retries up to queryRetryCount times for retryable
 *                             ApiErrors; never retries mutations.
 *     refetchOnWindowFocus  — driven by NEXT_PUBLIC_QUERY_REFETCH_ON_WINDOW_FOCUS.
 */
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { env } from "@/config/env";
import { ApiError } from "@/services/api/client";

// Defines the browser server-state cache policy. API data lives only in TanStack Query and is never duplicated in a client state store.
export function createQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        const message = mutation.meta?.successMessage;
        if (typeof message === "string") toast.success(message);
      },
      onError: (error, _variables, _context, mutation) => {
        if (shouldSuppressErrorToast(error, mutation.meta)) return;
        toast.error(errorMessage(error));
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data === undefined && !shouldSuppressErrorToast(error, query.meta))
          toast.error(errorMessage(error));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: env.queryStaleTimeMs,
        gcTime: env.queryGcTimeMs,
        retry: (count, error) =>
          count < env.queryRetryCount && (!(error instanceof ApiError) || error.retryable),
        refetchOnWindowFocus: env.queryRefetchOnWindowFocus,
      },
      mutations: { retry: 0 },
    },
  });
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "خطای پیش‌بینی‌نشده‌ای رخ داد.";
}

function shouldSuppressErrorToast(error: unknown, meta: Record<string, unknown> | undefined) {
  return meta?.suppressErrorToast === true || (error instanceof ApiError && error.status === 401);
}
