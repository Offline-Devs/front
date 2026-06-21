import { QueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";
import { ApiError } from "@/services/api/client";

// تنظیمات cache سراسری؛ داده‌های server-state در Zustand تکرار نمی‌شوند.
export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: env.queryStaleTimeMs, gcTime: env.queryGcTimeMs, retry: (count, error) => count < env.queryRetryCount && (!(error instanceof ApiError) || error.retryable), refetchOnWindowFocus: env.queryRefetchOnWindowFocus }, mutations: { retry: 0 } } });
}
