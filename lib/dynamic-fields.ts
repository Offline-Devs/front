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
import { normalizeNumericInput } from "./auth-flow";
import { parseStringArray } from "./safe-json";

function isEmptyDynamicValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === false ||
    (typeof value === "number" && Number.isNaN(value))
  );
}

export function validateDynamicFieldValues(
  fields: DynamicFieldDefinition[],
  values: Record<string, unknown>,
) {
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    if (!field.is_active) return;
    const value = values[field.name];
    if (isEmptyDynamicValue(value)) {
      if (!field.is_required) return;
      errors[field.name] = `${field.label} الزامی است.`;
      return;
    }
    if (field.field_type === "number" && typeof value !== "number")
      errors[field.name] = `${field.label} باید عدد باشد.`;
    if (field.field_type === "checkbox" && typeof value !== "boolean")
      errors[field.name] = `${field.label} باید تیک باشد.`;
    if (field.field_type === "text" && typeof value !== "string")
      errors[field.name] = `${field.label} باید متن باشد.`;
    if (field.field_type === "select") {
      const options = parseStringArray(field.options);
      if (typeof value !== "string" || !options.includes(value))
        errors[field.name] = `${field.label} معتبر نیست.`;
    }
    if (field.field_type === "date") {
      const date = typeof value === "string" ? normalizeNumericInput(value).replace(/-/g, "/") : "";
      if (!/^1[34]\d{2}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/.test(date))
        errors[field.name] = `${field.label} باید تاریخ معتبر باشد.`;
    }
  });
  return errors;
}
