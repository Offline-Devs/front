/**
 * @file components/admin/student-overview.tsx
 * @description Full admin view of a single student's profile, exams, mistakes,
 * statistics, and performance reports.
 *
 * Rendered by app/(admin)/admin/students/[id]/page.tsx. Uses Tabs to organise
 * content by domain. Each tab fires its own useQuery so data is fetched on
 * demand and cached independently.
 *
 * ProfileEditor (inner component) — inline edit form for the admin-editable
 *   subset of student fields (name, city, school, major). Uses local state
 *   for the form values and invalidates the student cache on save.
 *
 * PerformanceForm is rendered inline when editingPerformance is set, allowing
 *   the admin to edit an existing report without leaving the page.
 */
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ApprovalActions } from "./approval-actions";
import { PerformanceForm } from "@/components/performance/performance-form";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/formatters";
import { adminApi } from "@/services/api/admin.api";
import { performanceApi } from "@/services/api/performance.api";
import { queryKeys } from "@/services/api/query-keys";
import { statisticsApi } from "@/services/api/statistics.api";
import type { Student } from "@/types/student";
import type { PerformanceHistory } from "@/types/performance";

function ProfileEditor({ student }: { student: Student }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    first_name: student.first_name,
    last_name: student.last_name,
    city: student.city,
    school: student.school,
    major: student.major,
  });
  const update = useMutation({
    meta: { successMessage: "اطلاعات دانش‌آموز ذخیره شد." },
    mutationFn: () => adminApi.updateStudent(student.id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStudent(student.id) });
      await queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      setEditing(false);
    },
  });
  if (!editing)
    return (
      <div className="grid gap-4">
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["نام و نام خانوادگی", `${student.first_name} ${student.last_name}`],
            ["شماره موبایل", student.user?.phone ?? "—"],
            ["شهر", student.city],
            ["مدرسه", student.school],
            ["رشته", student.major],
            ["تاریخ تولد", student.jalali_birth_date],
          ].map(([term, value]) => (
            <div key={term} className="rounded-md bg-muted p-3">
              <dt className="text-xs text-muted-foreground">{term}</dt>
              <dd className="mt-1 font-bold" dir={term === "شماره موبایل" ? "ltr" : undefined}>
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
        <Button variant="outline" className="w-fit" onClick={() => setEditing(true)}>
          <Pencil className="size-4" />
          ویرایش مشخصات
        </Button>
      </div>
    );
  return (
    <form
      className="grid gap-4"
      onInvalid={() =>
        toast.error("لطفاً همه مشخصات ضروری را وارد کنید.", { id: "form-validation-error" })
      }
      onSubmit={(event) => {
        event.preventDefault();
        update.mutate();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(values).map(([name, value]) => (
          <FormField
            key={name}
            label={
              (
                {
                  first_name: "نام",
                  last_name: "نام خانوادگی",
                  city: "شهر",
                  school: "مدرسه",
                  major: "رشته",
                } as Record<string, string>
              )[name]
            }
          >
            <Input
              value={value}
              required
              onChange={(event) =>
                setValues((current) => ({ ...current, [name]: event.target.value }))
              }
            />
          </FormField>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="submit" loading={update.isPending}>
          ذخیره
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
          انصراف
        </Button>
      </div>
    </form>
  );
}

export function StudentOverview({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const [editingPerformance, setEditingPerformance] = useState<PerformanceHistory | null>(null);
  const student = useQuery({
    queryKey: queryKeys.adminStudent(studentId),
    queryFn: () => adminApi.student(studentId),
  });
  const exams = useQuery({
    queryKey: ["admin", "students", studentId, "exams"],
    queryFn: () => adminApi.exams(studentId),
  });
  const mistakes = useQuery({
    queryKey: ["admin", "students", studentId, "mistakes"],
    queryFn: () => adminApi.mistakes(studentId),
  });
  const statistics = useQuery({
    queryKey: ["admin", "students", studentId, "statistics"],
    queryFn: () => statisticsApi.adminStudent(studentId),
  });
  const performance = useQuery({
    queryKey: ["admin", "students", studentId, "performance"],
    queryFn: () => performanceApi.forStudent(studentId),
  });
  const removePerformance = useMutation({
    meta: { successMessage: "گزارش حذف شد." },
    mutationFn: performanceApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "students", studentId, "performance"],
      });
    },
  });
  if (student.isLoading) return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  if (student.isError)
    return <ApiErrorState error={student.error} retry={() => void student.refetch()} />;
  if (!student.data) return null;
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">
              {student.data.first_name} {student.data.last_name}
            </h1>
            <Badge variant={student.data.is_approved ? "success" : "warning"}>
              {student.data.is_approved ? "تأییدشده" : "در انتظار"}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">پرونده کامل دانش‌آموز</p>
        </div>
        <ApprovalActions studentId={studentId} approved={student.data.is_approved} />
      </div>
      <Tabs defaultValue="profile">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="profile">پروفایل</TabsTrigger>
          <TabsTrigger value="exams">آزمون‌ها</TabsTrigger>
          <TabsTrigger value="mistakes">اشتباهات</TabsTrigger>
          <TabsTrigger value="statistics">آمار</TabsTrigger>
          <TabsTrigger value="performance">گزارش‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>مشخصات دانش‌آموز</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditor key={student.data.updated_at} student={student.data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exams">
          <div className="grid gap-3 md:grid-cols-2">
            {exams.data?.map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <CardTitle>{exam.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {exam.jalali_date} · {exam.major} · {formatNumber(exam.total_subjects)} درس
                  </p>
                </CardContent>
              </Card>
            ))}
            {exams.isError && (
              <ApiErrorState error={exams.error} retry={() => void exams.refetch()} />
            )}
            {!exams.isLoading && !exams.data?.length && (
              <p className="text-sm text-muted-foreground">آزمونی ثبت نشده است.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="mistakes">
          <div className="grid gap-3 md:grid-cols-2">
            {mistakes.data?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.category || "بدون دسته‌بندی"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">سؤال {formatNumber(item.question_number)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.notes || "بدون یادداشت"}
                  </p>
                </CardContent>
              </Card>
            ))}
            {mistakes.isError && <ApiErrorState error={mistakes.error} />}
            {!mistakes.isLoading && !mistakes.data?.length && (
              <p className="text-sm text-muted-foreground">اشتباهی ثبت نشده است.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="statistics">
          {statistics.data ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-muted-foreground">تعداد آزمون</p>
                    <p className="mt-2 text-2xl font-black">
                      {formatNumber(statistics.data.total_exams)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-muted-foreground">میانگین عملکرد</p>
                    <p className="mt-2 text-2xl font-black">
                      {formatNumber(Math.round(statistics.data.average_score * 10) / 10)}٪
                    </p>
                  </CardContent>
                </Card>
              </div>
              {statistics.data.subject_stats.map((subject) => (
                <div
                  key={subject.subject_name}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <span>{subject.subject_name}</span>
                  <b>{formatNumber(Math.round(subject.percentage * 10) / 10)}٪</b>
                </div>
              ))}
            </div>
          ) : statistics.isError ? (
            <ApiErrorState error={statistics.error} />
          ) : (
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
          )}
        </TabsContent>
        <TabsContent value="performance">
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href={`/admin/students/${studentId}/performance/new`}>
                <Plus className="size-4" />
                گزارش جدید
              </Link>
            </Button>
          </div>
          {editingPerformance && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>ویرایش گزارش</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceForm
                  studentId={studentId}
                  record={editingPerformance}
                  onCancel={() => setEditingPerformance(null)}
                  onSaved={() => setEditingPerformance(null)}
                />
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {performance.data?.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{record.jalali_date}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="ویرایش گزارش"
                        onClick={() => setEditingPerformance(record)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            aria-label="حذف گزارش"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                        title="حذف گزارش؟"
                        description="برنامه، یادداشت و ارتباط فایل‌های این گزارش حذف می‌شوند."
                        confirmLabel="حذف"
                        loading={
                          removePerformance.isPending && removePerformance.variables === record.id
                        }
                        onConfirm={() => removePerformance.mutate(record.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="whitespace-pre-wrap text-sm leading-6">{record.study_plan}</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {record.notes}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(record.attachments.length)} پیوست
                  </span>
                </CardContent>
              </Card>
            ))}
            {performance.isError && <ApiErrorState error={performance.error} />}
            {!performance.isLoading && !performance.data?.length && (
              <p className="text-sm text-muted-foreground">گزارشی ثبت نشده است.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
