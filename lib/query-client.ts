import { QueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";

// تنظیمات cache سراسری؛ داده‌های server-state در Zustand تکرار نمی‌شوند.
export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: env.queryStaleTimeMs, gcTime: env.queryGcTimeMs, retry: env.queryRetryCount, refetchOnWindowFocus: env.queryRefetchOnWindowFocus }, mutations: { retry: 0 } } });
}
