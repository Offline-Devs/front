import { QueryClient } from "@tanstack/react-query";

// تنظیمات cache سراسری؛ داده‌های server-state در Zustand تکرار نمی‌شوند.
export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, gcTime: 10 * 60_000, retry: 1, refetchOnWindowFocus: false }, mutations: { retry: 0 } } });
}
