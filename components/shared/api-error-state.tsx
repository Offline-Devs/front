/**
 * @file components/shared/api-error-state.tsx
 * @description Reusable error state component for failed API queries.
 *
 * Renders a destructive-bordered panel with an alert icon, a user-facing Persian
 * error message (from ApiError.message or a generic fallback), and an optional
 * retry button shown only when ApiError.retryable is true.
 *
 * Used by list and detail components as the isError branch of their useQuery return.
 */
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/services/api/client";

export function ApiErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  const message = error instanceof ApiError ? error.message : "خطای پیش‌بینی‌نشده‌ای رخ داد.";
  const retryable = error instanceof ApiError ? error.retryable : true;
  return (
    <div
      role="alert"
      className="grid justify-items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="size-10 text-destructive" aria-hidden="true" />
      <p className="font-bold">{message}</p>
      {retry && retryable && (
        <Button variant="outline" onClick={retry}>
          تلاش دوباره
        </Button>
      )}
    </div>
  );
}
