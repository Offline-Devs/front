"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseStringArray } from "@/lib/safe-json";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";

type DynamicFieldRendererProps = {
  field: DynamicFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
};

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled,
}: DynamicFieldRendererProps) {
  if (!field.is_active) return null;

  if (field.field_type === "checkbox") {
    return (
      <div className="grid gap-2">
        <Checkbox
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked === true)}
          label={field.label}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
        />
        {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
      </div>
    );
  }

  if (field.field_type === "select") {
    const options = parseStringArray(field.options);
    return (
      <FormField label={field.label} error={error} required={field.is_required}>
        <Select value={typeof value === "string" ? value : ""} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger aria-label={field.label}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
          <SelectContent>
            {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
    );
  }

  return (
    <FormField label={field.label} error={error} required={field.is_required}>
      <Input
        type={field.field_type === "number" ? "number" : "text"}
        inputMode={field.field_type === "number" ? "decimal" : undefined}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={(event) => onChange(
          field.field_type === "number"
            ? (event.target.value === "" ? "" : event.target.valueAsNumber)
            : event.target.value,
        )}
        disabled={disabled}
        dir={field.field_type === "date" ? "ltr" : undefined}
        placeholder={field.field_type === "date" ? "۱۴۰۰/۰۱/۰۱" : undefined}
      />
    </FormField>
  );
}
