import { QueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";
import { ApiError } from "@/services/api/client";

// Defines the browser server-state cache policy. API data lives only in TanStack Query and is never duplicated in a client state store.
export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: env.queryStaleTimeMs, gcTime: env.queryGcTimeMs, retry: (count, error) => count < env.queryRetryCount && (!(error instanceof ApiError) || error.retryable), refetchOnWindowFocus: env.queryRefetchOnWindowFocus }, mutations: { retry: 0 } } });
}
