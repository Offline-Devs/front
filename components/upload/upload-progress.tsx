"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatFileSize, formatNumber } from "@/lib/formatters";

export function UploadProgress({
  value,
  loaded,
  total,
  label = "در حال بارگذاری",
  className,
}: {
  value: number;
  loaded?: number;
  total?: number;
  label?: string;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));
  const complete = percent >= 100;
  return (
    <div className={cn("grid gap-2 rounded-md border bg-card p-3", className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-foreground">
          {complete ? (
            <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <LoaderCircle
              className="size-4 shrink-0 animate-spin text-primary"
              aria-hidden="true"
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <bdi dir="ltr" className="font-bold text-primary">
          {formatNumber(percent)}%
        </bdi>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[var(--brand-strong)] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {loaded !== undefined && total !== undefined && total > 0 && (
        <p className="text-xs text-muted-foreground">
          <bdi dir="ltr">{formatFileSize(loaded)}</bdi>
          {" / "}
          <bdi dir="ltr">{formatFileSize(total)}</bdi>
        </p>
      )}
    </div>
  );
}
