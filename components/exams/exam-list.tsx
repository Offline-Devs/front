"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";
import { examsApi } from "@/services/api/exams.api";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { queryKeys } from "@/services/api/query-keys";

export function ExamList() {
  const queryClient = useQueryClient();
  const exams = useQuery({ queryKey: queryKeys.exams, queryFn: examsApi.list });
  const remove = useMutation({
    mutationFn: examsApi.remove,
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.exam(id) });
      await invalidateDependencies(queryClient, invalidation.exam);
    },
  });
  if (exams.isLoading)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  if (exams.isError)
    return <ApiErrorState error={exams.error} retry={() => void exams.refetch()} />;
  if (!exams.data?.length)
    return (
      <EmptyState
        title="هنوز آزمونی ثبت نشده است"
        description="با ثبت اولین آزمون، روند عملکرد درس‌ها قابل تحلیل می‌شود."
        action={
          <Button asChild>
            <Link href="/exams/new">
              <Plus className="size-4" />
              ثبت اولین آزمون
            </Link>
          </Button>
        }
      />
    );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {exams.data.map((exam) => (
        <Card key={exam.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{exam.title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {exam.jalali_date} · {exam.major}
                </p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary">
                {formatNumber(exam.total_subjects)} درس
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              برای مشاهده درصدها و جزئیات هر درس وارد صفحه آزمون شوید.
            </p>
          </CardContent>
          <CardFooter className="flex-wrap">
            <Button asChild size="sm">
              <Link href={`/exams/${exam.id}`}>
                <Eye className="size-4" />
                جزئیات
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/exams/${exam.id}/edit`}>
                <Pencil className="size-4" />
                ویرایش
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="size-4" />
                  حذف
                </Button>
              }
              title="حذف آزمون؟"
              description="تمام درس‌های این آزمون نیز حذف می‌شوند و این عملیات قابل بازگشت نیست."
              confirmLabel="حذف آزمون"
              loading={remove.isPending && remove.variables === exam.id}
              onConfirm={() => remove.mutate(exam.id)}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
