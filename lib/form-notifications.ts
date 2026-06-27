/**
 * @file lib/form-notifications.ts
 * @description React Hook Form error notification helpers.
 *
 * notifyFormErrors(errors) — called by form.handleSubmit's second argument
 *   (the invalid handler). Extracts the first field error message from the
 *   FieldErrors tree and displays it as an error toast so the user gets
 *   immediate feedback even when the form error is for a field that is
 *   scrolled out of view.
 *
 * notifyValidationMessage(message?) — shows a specific validation message or
 *   a generic fallback toast. Used by ProfileForm's dynamic-field validator.
 */
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

function firstErrorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  if ("message" in value && typeof value.message === "string") return value.message;
  for (const child of Object.values(value)) {
    const message = firstErrorMessage(child);
    if (message) return message;
  }
  return undefined;
}

export function notifyFormErrors(errors: FieldErrors) {
  notifyValidationMessage(firstErrorMessage(errors));
}

export function notifyValidationMessage(message?: string) {
  toast.error(message ?? "لطفاً اطلاعات فرم را بررسی کنید.", { id: "form-validation-error" });
}
