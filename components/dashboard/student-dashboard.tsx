"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, NotebookPen, Percent, Plus } from "lucide-react";
import Link from "next/link";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";
import { queryKeys } from "@/services/api/query-keys";
import { mistakesApi } from "@/services/api/mistakes.api";
import { statisticsApi } from "@/services/api/statistics.api";

export function StudentDashboard() {
  const dashboard = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: statisticsApi.dashboard,
    staleTime: 30_000,
  });
  const mistakes = useQuery({
    queryKey: queryKeys.mistakes,
    queryFn: mistakesApi.list,
    staleTime: 30_000,
  });
  if (dashboard.isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  if (dashboard.isError)
    return <ApiErrorState error={dashboard.error} retry={() => void dashboard.refetch()} />;
  if (!dashboard.data) return null;
  const cards = [
    { title: "آزمون‌ها", value: dashboard.data.total_exams, icon: BookOpenCheck },
    { title: "اشتباهات ثبت‌شده", value: dashboard.data.total_mistakes, icon: NotebookPen },
    {
      title: "میانگین عملکرد",
      value: `${formatNumber(dashboard.data.average_score)}٪`,
      icon: Percent,
    },
  ];
  return (
    <div className="grid gap-6">
      {!dashboard.data.is_approved && (
        <Alert variant="warning">
          <AlertTitle>پروفایل در انتظار تأیید است</AlertTitle>
          <AlertDescription>
            امکانات ثبت و تحلیل اطلاعات فعال هستند؛ تأیید نهایی توسط مدیر سامانه انجام می‌شود.
          </AlertDescription>
        </Alert>
      )}
      {!dashboard.data.has_study_plan && (
        <Alert>
          <AlertTitle>برنامه مطالعاتی فعالی ندارید</AlertTitle>
          <AlertDescription>
            پس از ثبت برنامه توسط مشاور، وضعیت آن در همین داشبورد نمایش داده می‌شود.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="flex items-center justify-between pt-5">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="mt-2 text-2xl font-black">
                  {typeof value === "number" ? formatNumber(value) : value}
                </p>
              </div>
              <span className="grid size-11 place-items-center rounded-full bg-accent text-primary">
                <Icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="grid content-start gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">آخرین آزمون‌ها</h2>
            <Button asChild variant="link">
              <Link href="/exams">مشاهده همه</Link>
            </Button>
          </div>
          {dashboard.data.recent_exams.length ? (
            <div className="grid gap-3">
              {dashboard.data.recent_exams.slice(0, 3).map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exams/${exam.id}`}
                  className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
                >
                  <h3 className="font-bold">{exam.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {exam.jalali_date} · {exam.major}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>هنوز داده‌ای برای تحلیل ندارید</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/exams/new">
                    <Plus className="size-4" />
                    ثبت اولین آزمون
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
        <section className="grid content-start gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">آخرین اشتباهات</h2>
            <Button asChild variant="link">
              <Link href="/mistakes">مشاهده همه</Link>
            </Button>
          </div>
          {mistakes.data?.length ? (
            <div className="grid gap-3">
              {mistakes.data.slice(0, 3).map((mistake) => (
                <div key={mistake.id} className="rounded-lg border bg-card p-4">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-bold">{mistake.category}</h3>
                    <span className="text-xs text-muted-foreground">
                      سؤال {formatNumber(mistake.question_number)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {mistake.notes || "بدون یادداشت"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>اشتباهی ثبت نشده است</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/mistakes/new">
                    <Plus className="size-4" />
                    ثبت اشتباه
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
