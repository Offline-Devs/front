"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUp, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { env } from "@/config/env";
import { parseStringArray } from "@/lib/safe-json";
import {
  performanceSchema,
  type PerformanceFormOutput,
  type PerformanceFormValues,
} from "@/schemas/performance.schema";
import { performanceApi } from "@/services/api/performance.api";
import { queryKeys } from "@/services/api/query-keys";
import { uploadApi } from "@/services/api/upload.api";
import type { PerformanceHistory } from "@/types/performance";

export function PerformanceForm({
  studentId,
  record,
  onSaved,
  onCancel,
}: {
  studentId: string;
  record?: PerformanceHistory;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState(() => parseStringArray(record?.files));
  const [fileError, setFileError] = useState("");
  const form = useForm<PerformanceFormValues, unknown, PerformanceFormOutput>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      jalali_date: record?.jalali_date ?? "",
      notes: record?.notes ?? "",
      study_plan: record?.study_plan ?? "",
      files: existingFiles,
    },
  });
  const save = useMutation({
    mutationFn: async (values: PerformanceFormOutput) => {
      const uploaded = selectedFiles.length
        ? await uploadApi.multiple(selectedFiles, "document")
        : [];
      const files = JSON.stringify([...existingFiles, ...uploaded.map((item) => item.url)]);
      if (record)
        return performanceApi.update(record.id, {
          notes: values.notes,
          study_plan: values.study_plan,
          files,
        });
      return performanceApi.create(studentId, {
        jalali_date: values.jalali_date,
        notes: values.notes,
        study_plan: values.study_plan,
        files,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "students", studentId, "performance"],
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStudent(studentId) });
      toast.success(record ? "گزارش ویرایش شد." : "گزارش ثبت شد.");
      onSaved?.();
      if (!record) {
        router.replace(`/admin/students/${studentId}`);
        router.refresh();
      }
    },
  });
  function chooseFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files);
    if (existingFiles.length + selectedFiles.length + next.length > env.multipleUploadMaxFiles) {
      setFileError(`حداکثر ${env.multipleUploadMaxFiles.toLocaleString("fa-IR")} فایل مجاز است.`);
      return;
    }
    if (next.some((file) => file.size > env.documentUploadMaxMb * 1024 * 1024)) {
      setFileError(
        `حجم هر فایل حداکثر ${env.documentUploadMaxMb.toLocaleString("fa-IR")} مگابایت است.`,
      );
      return;
    }
    setFileError("");
    setSelectedFiles((current) => [...current, ...next]);
  }
  const displayedFiles = [
    ...existingFiles.map((url) => ({
      name: url.split("/").pop() ?? url,
      remove: () => setExistingFiles((items) => items.filter((item) => item !== url)),
    })),
    ...selectedFiles.map((file) => ({
      name: file.name,
      remove: () => setSelectedFiles((items) => items.filter((item) => item !== file)),
    })),
  ];
  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={form.handleSubmit((values) => save.mutate(values))}
    >
      <FormField label="تاریخ گزارش" error={form.formState.errors.jalali_date?.message} required>
        <Input
          {...form.register("jalali_date")}
          disabled={Boolean(record)}
          dir="ltr"
          inputMode="numeric"
          placeholder="۱۴۰۵/۰۳/۳۱"
          className="text-left"
        />
      </FormField>
      <FormField label="برنامه مطالعاتی" error={form.formState.errors.study_plan?.message}>
        <Textarea {...form.register("study_plan")} rows={6} placeholder="برنامه روزانه یا هفتگی…" />
      </FormField>
      <FormField label="یادداشت مشاور" error={form.formState.errors.notes?.message}>
        <Textarea {...form.register("notes")} rows={4} />
      </FormField>
      <div className="grid gap-3">
        <label className="text-sm font-bold" htmlFor="performance-files">
          فایل‌های پیوست
        </label>
        <Input
          id="performance-files"
          type="file"
          multiple
          onChange={(event) => chooseFiles(event.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          حداکثر {env.multipleUploadMaxFiles.toLocaleString("fa-IR")} فایل؛ هر فایل حداکثر{" "}
          {env.documentUploadMaxMb.toLocaleString("fa-IR")} مگابایت.
        </p>
        {displayedFiles.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
          >
            <span className="truncate">{item.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`حذف ${item.name}`}
              onClick={item.remove}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
        {fileError && (
          <p className="text-xs text-destructive" role="alert">
            {fileError}
          </p>
        )}
      </div>
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
          {save.isPending ? null : record ? (
            <Save className="size-4" />
          ) : (
            <FileUp className="size-4" />
          )}
          {record ? "ذخیره تغییرات" : "ثبت گزارش"}
        </Button>
      </div>
    </form>
  );
}
