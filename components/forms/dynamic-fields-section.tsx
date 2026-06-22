"use client";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";
export function DynamicFieldsSection({
  fields,
  values,
  errors,
  disabled,
  onChange,
}: {
  fields: DynamicFieldDefinition[];
  values: Record<string, unknown>;
  errors: Record<string, string>;
  disabled?: boolean;
  onChange: (name: string, value: unknown) => void;
}) {
  const active = fields.filter((field) => field.is_active);
  if (!active.length) return null;
  return (
    <section className="grid gap-4 rounded-lg border p-4">
      <div>
        <h2 className="font-bold">اطلاعات تکمیلی</h2>
        <p className="text-sm text-muted-foreground">فیلدهای تعریف‌شده توسط مدیر سامانه.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {active.map((field) => (
          <DynamicFieldRenderer
            key={field.id}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            disabled={disabled}
            onChange={(value) => onChange(field.name, value)}
          />
        ))}
      </div>
    </section>
  );
}
