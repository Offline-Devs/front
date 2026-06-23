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
