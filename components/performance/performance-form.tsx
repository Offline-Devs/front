/**
 * @file components/performance/performance-form.tsx
 * @description Admin form for creating and editing student performance reports.
 *
 * Used in:
 *   - app/(admin)/admin/students/[id]/performance/new/page.tsx (create mode)
 *   - components/admin/student-overview.tsx (edit mode, inline)
 *
 * Fields: report date (Jalali, create-only), study plan, advisor notes,
 *         and file attachment URLs.
 *
 * File attachment design: The backend's file upload endpoints (/upload,
 * /upload/multiple) require the "student" role. Since this form is used
 * exclusively by administrators, the form does NOT use the upload API.
 * Instead, the admin pastes direct URLs to files hosted on any public
 * service (Google Drive, Dropbox, a CDN, etc.). These URLs are stored as
 * a JSON-encoded string array in the backend's `files` field and rendered
 * as download links in the student-facing PerformanceTimeline component.
 *
 * State management: On successful save, TanStack Query cache keys for the
 * student's performance list and student overview are invalidated so the
 * UI updates reactively without requiring a manual page reload.
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUp, Link2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { parseStringArray } from "@/lib/safe-json";
import { notifyFormErrors } from "@/lib/form-notifications";
import {
  performanceSchema,
  type PerformanceFormOutput,
  type PerformanceFormValues,
} from "@/schemas/performance.schema";
import { performanceApi } from "@/services/api/performance.api";
import { queryKeys } from "@/services/api/query-keys";
import type { PerformanceHistory } from "@/types/performance";

function attachmentLabel(url: string, index: number) {
  try {
    const name = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
    return name || `پیوست ${index + 1}`;
  } catch {
    return url.length > 60 ? `${url.slice(0, 60)}…` : url;
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

  // Attachment URLs are managed separately from react-hook-form state.
  // The admin adds external URLs via a text input; on save these are
  // JSON-encoded and sent as the `files` field to the backend.
  const [newUrl, setNewUrl] = useState("");
  const [attachedUrls, setAttachedUrls] = useState<string[]>(() => parseStringArray(record?.files));

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

  function addUrl() {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error("آدرس URL معتبر نیست.", { id: "performance-url-validation" });
      return;
    }
    if (attachedUrls.includes(trimmed)) {
      toast.error("این پیوند قبلاً اضافه شده است.", { id: "performance-url-duplicate" });
      return;
    }
    setAttachedUrls((prev) => [...prev, trimmed]);
    setNewUrl("");
  }

  function removeUrl(url: string) {
    setAttachedUrls((prev) => prev.filter((u) => u !== url));
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
      // Invalidate the student's performance list and overview so the UI
      // updates reactively without a manual page reload.
      await queryClient.invalidateQueries({
        queryKey: ["admin", "students", studentId, "performance"],
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStudent(studentId) });
      onSaved?.();
      if (!record) {
        router.replace(`/admin/students/${studentId}`);
      }
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
        <Textarea {...form.register("study_plan")} rows={6} placeholder="برنامه روزانه یا هفتگی…" />
      </FormField>

      <FormField label="یادداشت مشاور" error={form.formState.errors.notes?.message}>
        <Textarea {...form.register("notes")} rows={4} />
      </FormField>

      {/* URL-based file attachment — replaces the file-picker upload.
          The backend upload endpoint requires student role; admins must
          use external hosting (Google Drive, Dropbox, CDN, etc.) and
          paste the direct link here. */}
      <div className="grid gap-3">
        <p className="text-sm font-bold">فایل‌های پیوست</p>
        <p className="text-xs text-muted-foreground">
          لینک مستقیم فایل را از Google Drive، Dropbox یا هر سرویس دیگری وارد کنید. دانش‌آموز
          می‌تواند این پیوندها را در بخش عملکرد خود مشاهده و دانلود کند.
        </p>
        <div className="flex gap-2">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://drive.google.com/…"
            dir="ltr"
            className="text-left"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addUrl}>
            <Link2 className="size-4" />
            افزودن
          </Button>
        </div>
        {attachedUrls.map((url, index) => (
          <div
            key={url}
            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-primary hover:underline"
              title={url}
            >
              {attachmentLabel(url, index)}
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
        ))}
        {attachedUrls.length === 0 && (
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
