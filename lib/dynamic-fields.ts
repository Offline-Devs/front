/**
 * @file lib/dynamic-fields.ts
 * @description Client-side validation for admin-defined dynamic field values.
 *
 * validateDynamicFieldValues(fields, values) — iterates the active, required
 *   field definitions and returns a Record<fieldName, errorMessage> for any
 *   required field whose value is empty, null, undefined, false, or NaN.
 *   Used by ProfileForm before submitting dynamic-field data to the backend.
 */
import type { DynamicFieldDefinition } from "@/types/dynamic-field";
export function validateDynamicFieldValues(
  fields: DynamicFieldDefinition[],
  values: Record<string, unknown>,
) {
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    if (!field.is_active || !field.is_required) return;
    const value = values[field.name];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false ||
      (typeof value === "number" && Number.isNaN(value))
    )
      errors[field.name] = `${field.label} الزامی است.`;
  });
  return errors;
}
