/**
 * @file components/exams/exam-summary.tsx
 * @description Single exam detail view showing per-subject score breakdowns.
 *
 * Fetches GET /exams/:id via queryKeys.exam(id). The response is mapped by
 * exam.mapper.ts which calculates subject percentages from raw correct/wrong
 * counts and the exam's negative_mark.
 *
 * Renders a card per subject with correct / wrong / blank counts and the
 * derived percentage score, plus a link to the exam edit page.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Pencil } from "lucide-react";
import Link from "next/link";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";
import { examsApi } from "@/services/api/exams.api";
import { queryKeys } from "@/services/api/query-keys";

export function ExamSummary({ id }: { id: string }) {
  const exam = useQuery({ queryKey: queryKeys.exam(id), queryFn: () => examsApi.get(id) });
  if (exam.isLoading) return <div className="h-80 animate-pulse rounded-lg bg-muted" />;
  if (exam.isError) return <ApiErrorState error={exam.error} retry={() => void exam.refetch()} />;
  if (!exam.data) return null;
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="link" className="px-0">
            <Link href="/exams">
              <ArrowRight className="size-4" />
              بازگشت به آزمون‌ها
            </Link>
          </Button>
          <h1 className="text-2xl font-black sm:text-3xl">{exam.data.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {exam.data.jalali_date} · {exam.data.major}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            نمره منفی هر پاسخ غلط: {formatNumber(exam.data.negative_mark)}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/exams/${id}/edit`}>
            <Pencil className="size-4" />
            ویرایش آزمون
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {exam.data.subjects?.map((subject) => (
          <Card key={subject.id || subject.subject_name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{subject.subject_name}</CardTitle>
                <span className="text-2xl font-black text-primary">
                  {formatNumber(subject.percentage)}٪
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-md bg-success/10 p-3">
                <b className="block text-success">{formatNumber(subject.correct)}</b>صحیح
              </div>
              <div className="rounded-md bg-destructive/10 p-3">
                <b className="block text-destructive">{formatNumber(subject.wrong)}</b>غلط
              </div>
              <div className="rounded-md bg-muted p-3">
                <b className="block">{formatNumber(subject.blank)}</b>نزده
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
