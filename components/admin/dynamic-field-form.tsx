"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { notifyFormErrors } from "@/lib/form-notifications";
import {
  dynamicFieldSchema,
  normalizeDynamicFieldOptions,
  type DynamicFieldFormValues,
} from "@/schemas/dynamic-field.schema";
import { adminApi } from "@/services/api/admin.api";
import type {
  DynamicFieldDefinition,
  DynamicFieldInput,
  DynamicFieldType,
} from "@/types/dynamic-field";
export function DynamicFieldForm({
  field,
  onSaved,
  onCancel,
}: {
  field?: DynamicFieldDefinition;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<DynamicFieldFormValues>({
    resolver: zodResolver(dynamicFieldSchema),
    defaultValues: {
      entity_type: (field?.entity_type as "student" | "exam" | "mistake") ?? "student",
      name: field?.name ?? "",
      label: field?.label ?? "",
      field_type: field?.field_type ?? "text",
      options: field?.options ?? "",
      is_required: field?.is_required ?? false,
    },
  });
  const entity = useWatch({ control: form.control, name: "entity_type" });
  const type = useWatch({ control: form.control, name: "field_type" });
  const required = useWatch({ control: form.control, name: "is_required" });
  const save = useMutation<unknown, Error, DynamicFieldFormValues>({
    meta: { successMessage: field ? "فیلد ویرایش شد." : "فیلد ایجاد شد." },
    mutationFn: (values) => {
      const input: DynamicFieldInput = {
        ...values,
        field_type: values.field_type as DynamicFieldType,
        options: normalizeDynamicFieldOptions(values.field_type, values.options),
      };
      return field ? adminApi.updateField(field.id, input) : adminApi.createField(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "dynamic-fields"] });
      form.reset();
      onSaved?.();
    },
  });
  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={form.handleSubmit((values) => save.mutate(values), notifyFormErrors)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="موجودیت" error={form.formState.errors.entity_type?.message} required>
          <Select
            value={entity}
            onValueChange={(value) =>
              form.setValue("entity_type", value as "student" | "exam" | "mistake")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">پروفایل دانش‌آموز</SelectItem>
              <SelectItem value="exam">آزمون</SelectItem>
              <SelectItem value="mistake">اشتباه</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="نوع فیلد" error={form.formState.errors.field_type?.message} required>
          <Select
            value={type}
            onValueChange={(value) => form.setValue("field_type", value as DynamicFieldType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">متن</SelectItem>
              <SelectItem value="number">عدد</SelectItem>
              <SelectItem value="select">انتخابی</SelectItem>
              <SelectItem value="checkbox">تیک</SelectItem>
              <SelectItem value="date">تاریخ</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label="نام فنی"
          hint="نمونه: grade_level"
          error={form.formState.errors.name?.message}
          required
        >
          <Input {...form.register("name")} dir="ltr" className="text-left" />
        </FormField>
        <FormField label="عنوان نمایشی" error={form.formState.errors.label?.message} required>
          <Input {...form.register("label")} />
        </FormField>
      </div>
      {type === "select" && (
        <FormField
          label="گزینه‌ها (JSON)"
          hint={'نمونه: ["گزینه اول","گزینه دوم"]'}
          error={form.formState.errors.options?.message}
          required
        >
          <Textarea {...form.register("options")} dir="ltr" className="font-mono text-left" />
        </FormField>
      )}
      <Checkbox
        checked={required}
        onCheckedChange={(checked) => form.setValue("is_required", checked === true)}
        label="تکمیل این فیلد الزامی باشد"
      />
      {save.isError && (
        <Alert variant="destructive">
          <AlertDescription>{save.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            انصراف
          </Button>
        )}
        <Button type="submit" loading={save.isPending}>
          <Save className="size-4" />
          {field ? "ذخیره ویرایش" : "ایجاد فیلد"}
        </Button>
      </div>
    </form>
  );
}
