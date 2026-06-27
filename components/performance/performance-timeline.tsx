/**
 * @file components/performance/performance-timeline.tsx
 * @description Student-facing timeline of performance report entries.
 *
 * Read-only view — students cannot create or edit performance records.
 * Reports are created and managed by administrators via PerformanceForm.
 *
 * Fetches GET /students/performance via performanceApi.mine(). The response
 * is mapped by the performance mapper which resolves file attachment URLs
 * through the same-origin BFF proxy.
 *
 * Renders each record as a timeline entry with study plan, advisor notes, and
 * downloadable file attachment links.
 */
"use client";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Download, FileText } from "lucide-react";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { performanceApi } from "@/services/api/performance.api";
import { queryKeys } from "@/services/api/query-keys";

function attachmentName(url: string, index: number) {
  try {
    const name = decodeURIComponent(new URL(url, "http://local").pathname.split("/").pop() ?? "");
    return name || `پیوست ${index + 1}`;
  } catch {
    return `پیوست ${index + 1}`;
  }
}

export function PerformanceTimeline() {
  const performance = useQuery({
    queryKey: queryKeys.performance,
    queryFn: performanceApi.mine,
    staleTime: 60_000,
  });
  if (performance.isLoading)
    return (
      <div className="grid gap-5">
        {[1, 2].map((item) => (
          <div key={item} className="h-56 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  if (performance.isError)
    return <ApiErrorState error={performance.error} retry={() => void performance.refetch()} />;
  if (!performance.data?.length)
    return (
      <EmptyState
        title="هنوز گزارشی ثبت نشده است"
        description="یادداشت‌ها و برنامه‌های مطالعاتی ثبت‌شده توسط مشاور در این صفحه نمایش داده می‌شوند."
      />
    );
  return (
    <ol className="relative grid gap-6 before:absolute before:inset-y-3 before:right-3 before:w-px before:bg-border sm:before:right-4">
      {performance.data.map((item) => (
        <li key={item.id} className="relative pr-9 sm:pr-12">
          <span className="absolute right-0 top-5 grid size-7 place-items-center rounded-full border-4 border-background bg-primary sm:size-9">
            <CalendarDays
              className="size-3.5 text-primary-foreground sm:size-4"
              aria-hidden="true"
            />
          </span>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>گزارش {item.jalali_date}</CardTitle>
                <time className="text-sm text-muted-foreground" dateTime={item.date}>
                  {item.jalali_date}
                </time>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              {item.study_plan && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 font-bold">
                    <FileText className="size-4 text-primary" />
                    برنامه مطالعاتی
                  </h3>
                  <p className="whitespace-pre-wrap rounded-md bg-accent/50 p-4 text-sm leading-7">
                    {item.study_plan}
                  </p>
                </section>
              )}
              {item.notes && (
                <section>
                  <h3 className="mb-2 font-bold">یادداشت مشاور</h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {item.notes}
                  </p>
                </section>
              )}
              {item.attachments.length > 0 && (
                <section>
                  <h3 className="mb-2 font-bold">فایل‌های پیوست</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {item.attachments.map((url, index) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-md border p-3 text-sm font-medium text-primary hover:bg-muted"
                        >
                          <Download className="size-4" aria-hidden="true" />
                          <span className="truncate">{attachmentName(url, index)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}
