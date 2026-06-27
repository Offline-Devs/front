/**
 * @file schemas/dynamic-field.schema.ts
 * @description Zod validation schema for dynamic field definition form inputs.
 *
 * Validates entity_type (student | exam | mistake), field_type
 * (text | number | select | checkbox | date), technical name (lowercase
 * snake_case only), display label, JSON options string (required and validated
 * as a non-empty string array for select type), and is_required flag.
 *
 * normalizeDynamicFieldOptions(fieldType, options) — serialises the options
 *   string to a canonical trimmed JSON array for select fields, or an empty
 *   string for all other types.
 */
import { z } from "zod";
import { parseStringArray } from "@/lib/safe-json";
export const dynamicFieldSchema = z
  .object({
    entity_type: z.enum(["student", "exam", "mistake"]),
    name: z
      .string()
      .trim()
      .regex(
        /^[a-z][a-z0-9_]*$/,
        "نام فنی باید با حرف لاتین شروع شود و فقط شامل حروف کوچک، عدد و _ باشد.",
      ),
    label: z.string().trim().min(2, "عنوان نمایشی را وارد کنید."),
    field_type: z.enum(["text", "number", "select", "checkbox", "date"]),
    options: z.string(),
    is_required: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.field_type !== "select") return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(value.options);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "گزینه‌ها باید JSON معتبر باشند.",
      });
      return;
    }
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      parsed.some((item) => typeof item !== "string" || !item.trim())
    )
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "گزینه‌ها باید آرایه‌ای غیرخالی از متن باشند.",
      });
  });
export function normalizeDynamicFieldOptions(fieldType: string, options: string) {
  return fieldType === "select"
    ? JSON.stringify(
        parseStringArray(options).map((item) => item.trim()),
        null,
        0,
      )
    : "";
}
export type DynamicFieldFormValues = z.input<typeof dynamicFieldSchema>;
