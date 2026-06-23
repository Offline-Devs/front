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
      onError: (error) => toast.error(errorMessage(error)),
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data === undefined && query.meta?.suppressErrorToast !== true)
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
