/**
 * @file components/performance/performance-form.tsx
 * @description Admin form for creating and editing student performance reports.
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUp, Paperclip, Save, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { UploadProgress } from "@/components/upload/upload-progress";
import { env } from "@/config/env";
import { notifyFormErrors } from "@/lib/form-notifications";
import { formatFileSize } from "@/lib/formatters";
import { parseStringArray } from "@/lib/safe-json";
import { validateUploadFiles } from "@/lib/upload-policy";
import { resolveUploadUrl } from "@/lib/upload-url";
import {
  performanceSchema,
  type PerformanceFormOutput,
  type PerformanceFormValues,
} from "@/schemas/performance.schema";
import { performanceApi } from "@/services/api/performance.api";
import { queryKeys } from "@/services/api/query-keys";
import { uploadApi } from "@/services/api/upload.api";
import type { PerformanceHistory } from "@/types/performance";

function attachmentLabel(url: string, index: number) {
  try {
    const name = decodeURIComponent(new URL(url, "http://local").pathname.split("/").pop() ?? "");
    return name || `پیوست ${index + 1}`;
  } catch {
    return url.length > 60 ? `${url.slice(0, 60)}...` : url;
  }
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedUrls, setAttachedUrls] = useState<string[]>(() => parseStringArray(record?.files));
  const [uploadProgress, setUploadProgress] = useState<{
    percent: number;
    loaded?: number;
    total?: number;
  } | null>(null);

  const form = useForm<PerformanceFormValues, unknown, PerformanceFormOutput>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      jalali_date: record?.jalali_date ?? "",
      notes: record?.notes ?? "",
      study_plan: record?.study_plan ?? "",
      files: [],
    },
  });

  const reportDate = useWatch({ control: form.control, name: "jalali_date" });

  const upload = useMutation({
    meta: { successMessage: "فایل‌ها بارگذاری شدند." },
    mutationFn: (files: File[]) =>
      uploadApi.multiple(files, "document", {
        onProgress: ({ percent, loaded, total }) => setUploadProgress({ percent, loaded, total }),
      }),
    onSuccess: (files) => {
      setAttachedUrls((prev) => {
        const next = [...prev];
        for (const file of files) {
          if (!next.includes(file.url)) next.push(file.url);
        }
        return next;
      });
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setUploadProgress({ percent: 100, loaded: totalSize, total: totalSize });
      window.setTimeout(() => setUploadProgress(null), 900);
    },
    onError: () => {
      setUploadProgress(null);
    },
  });

  function selectFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    const error = validateUploadFiles(files, {
      maxBytes: env.documentUploadMaxMb * 1024 * 1024,
      maxFiles: env.multipleUploadMaxFiles,
    });
    if (error) {
      toast.error(error, { id: "performance-upload-validation" });
      return;
    }
    setUploadProgress({ percent: 0 });
    upload.mutate(files);
  }

  function removeUrl(url: string) {
    setAttachedUrls((prev) => prev.filter((item) => item !== url));
  }

  const save = useMutation({
    meta: { successMessage: record ? "گزارش ویرایش شد." : "گزارش ثبت شد." },
    mutationFn: async (values: PerformanceFormOutput) => {
      const files = JSON.stringify(attachedUrls);
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
      onSaved?.();
      if (!record) router.replace(`/admin/students/${studentId}`);
    },
  });

  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={form.handleSubmit((values) => save.mutate(values), notifyFormErrors)}
    >
      <FormField label="تاریخ گزارش" error={form.formState.errors.jalali_date?.message} required>
        <JalaliDatePicker
          value={reportDate}
          disabled={Boolean(record)}
          title="انتخاب تاریخ گزارش"
          placeholder="انتخاب تاریخ گزارش"
          onChange={(value) =>
            form.setValue("jalali_date", value, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        />
      </FormField>

      <FormField label="برنامه مطالعاتی" error={form.formState.errors.study_plan?.message}>
        <Textarea
          {...form.register("study_plan")}
          rows={6}
          placeholder="برنامه روزانه یا هفتگی..."
        />
      </FormField>

      <FormField label="یادداشت مشاور" error={form.formState.errors.notes?.message}>
        <Textarea {...form.register("notes")} rows={4} />
      </FormField>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">فایل‌های پیوست</p>
            <p className="text-xs text-muted-foreground">
              هر فایل تا {formatFileSize(env.documentUploadMaxMb * 1024 * 1024)} و هر بار حداکثر{" "}
              {env.multipleUploadMaxFiles} فایل قابل بارگذاری است.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            loading={upload.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {upload.isPending ? null : <Upload className="size-4" />}
            انتخاب فایل
          </Button>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            multiple
            disabled={upload.isPending}
            onChange={(event) => {
              selectFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {upload.isError && (
          <Alert variant="destructive">
            <AlertDescription>{upload.error.message}</AlertDescription>
          </Alert>
        )}

        {attachedUrls.map((url, index) => {
          const resolvedUrl = resolveUploadUrl(url);
          return (
            <div
              key={url}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
            >
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-2 text-primary hover:underline"
                title={resolvedUrl}
              >
                <Paperclip className="size-4 shrink-0" />
                <span className="truncate">{attachmentLabel(url, index)}</span>
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`حذف پیوست ${index + 1}`}
                onClick={() => removeUrl(url)}
              >
                <X className="size-4" />
              </Button>
            </div>
          );
        })}

        {uploadProgress && (upload.isPending || uploadProgress.percent >= 100) && (
          <UploadProgress
            value={uploadProgress.percent}
            loaded={uploadProgress.loaded}
            total={uploadProgress.total}
            label="بارگذاری پیوست‌ها"
          />
        )}
        {attachedUrls.length === 0 && !upload.isPending && (
          <p className="text-xs text-muted-foreground">هیچ پیوستی اضافه نشده است.</p>
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
        <Button type="submit" loading={save.isPending} disabled={upload.isPending}>
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
