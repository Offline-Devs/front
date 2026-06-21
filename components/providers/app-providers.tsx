"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";

// مرز providerهای کلاینت؛ QueryClient برای هر نشست مرورگر فقط یک بار ساخته می‌شود.
export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}<ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>;
}
