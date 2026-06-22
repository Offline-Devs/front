"use client";

import { useMutation } from "@tanstack/react-query";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { resolveUploadUrl } from "@/lib/upload-url";
import { uploadApi } from "@/services/api/upload.api";
import { PROFILE_IMAGE_TYPES, validateUploadFiles } from "@/lib/upload-policy";

type FileUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export function FileUploader({ value, onChange, disabled }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value ? resolveUploadUrl(value) : null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const upload = useMutation({
    mutationFn: (file: File) => uploadApi.one(file, "profile"),
    onSuccess: (response) => {
      onChange(response.url);
      setPreviewUrl(resolveUploadUrl(response.url));
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectFile(file?: File) {
    setValidationError(null);
    if (!file) return;
    const error = validateUploadFiles([file], {
      maxBytes: env.profileUploadMaxMb * 1024 * 1024,
      maxFiles: 1,
      mimeTypes: PROFILE_IMAGE_TYPES,
    });
    if (error) {
      setValidationError(error);
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    upload.mutate(file);
  }

  function removeFile() {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setValidationError(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div
          role="img"
          aria-label={previewUrl ? "پیش‌نمایش عکس پروفایل" : "عکس پروفایل انتخاب نشده"}
          className="grid size-24 shrink-0 place-items-center rounded-full border bg-muted bg-cover bg-center text-muted-foreground"
          style={
            previewUrl
              ? { backgroundImage: `url(${JSON.stringify(previewUrl).slice(1, -1)})` }
              : undefined
          }
        >
          {!previewUrl && <Camera className="size-8" aria-hidden="true" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            loading={upload.isPending}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud className="size-4" aria-hidden="true" />
            انتخاب و آپلود عکس
          </Button>
          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              disabled={disabled || upload.isPending}
              onClick={removeFile}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              حذف عکس
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={PROFILE_IMAGE_TYPES.join(",")}
        className="sr-only"
        disabled={disabled || upload.isPending}
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
      <p className="text-xs text-muted-foreground">
        فرمت JPG، PNG یا WebP؛ حداکثر {env.profileUploadMaxMb.toLocaleString("fa-IR")} مگابایت.
      </p>
      {(validationError || upload.isError) && (
        <p className="text-xs text-destructive" role="alert">
          {validationError ?? upload.error?.message}
        </p>
      )}
    </div>
  );
}
