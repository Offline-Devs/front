"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mistakeSchema, type MistakeFormOutput, type MistakeFormValues } from "@/schemas/mistake.schema";
import { examsApi } from "@/services/api/exams.api";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { mistakesApi } from "@/services/api/mistakes.api";
import { queryKeys } from "@/services/api/query-keys";
import type { Mistake } from "@/types/mistake";
import { DynamicFieldsSection } from "@/components/forms/dynamic-fields-section";
import { dynamicFieldsApi } from "@/services/api/dynamic-fields.api";
import { validateDynamicFieldValues } from "@/lib/dynamic-fields";

export function MistakeForm({ mistake, onSaved, onCancel }: { mistake?: Mistake; onSaved?: () => void; onCancel?: () => void }) {
  const router = useRouter(); const queryClient = useQueryClient();
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});
  const form = useForm<MistakeFormValues, unknown, MistakeFormOutput>({ resolver: zodResolver(mistakeSchema), defaultValues: { exam_id: mistake?.exam_id ?? "", subject_exam_id: mistake?.subject_exam_id ?? "", question_number: mistake?.question_number ?? 1, category: mistake?.category ?? "", notes: mistake?.notes ?? "", dynamic_fields: mistake?.dynamic_fields ?? {} } });
  const examId = useWatch({ control: form.control, name: "exam_id" });
  const subjectExamId = useWatch({ control: form.control, name: "subject_exam_id" });
  const dynamicValues = useWatch({ control: form.control, name: "dynamic_fields" });
  const exams = useQuery({ queryKey: queryKeys.exams, queryFn: examsApi.list, staleTime: 30_000 });
  const selectedExam = exams.data?.find((exam) => exam.id === examId);
  const dynamicFields = useQuery({ queryKey: ["dynamic-fields", "mistake"], queryFn: () => dynamicFieldsApi.list("mistake"), retry: false, staleTime: 300_000 });
  const save = useMutation({ mutationFn: (values: MistakeFormOutput) => mistake ? mistakesApi.update(mistake.id, values) : mistakesApi.create(values), onSuccess: async () => { await invalidateDependencies(queryClient, invalidation.mistake); onSaved?.(); if (!mistake) { router.replace("/mistakes"); router.refresh(); } } });
  function submit(values: MistakeFormOutput) { const errors = validateDynamicFieldValues(dynamicFields.data ?? [], values.dynamic_fields); setDynamicErrors(errors); if (!Object.keys(errors).length) save.mutate(values); }
  return <form className="grid gap-5" noValidate onSubmit={form.handleSubmit(submit)}><div className="grid gap-4 sm:grid-cols-2"><FormField label="آزمون مرتبط" hint="اختیاری" error={form.formState.errors.exam_id?.message}><Select value={examId || "none"} onValueChange={(value) => { form.setValue("exam_id", value === "none" ? "" : value); form.setValue("subject_exam_id", ""); }}><SelectTrigger><SelectValue placeholder="بدون آزمون" /></SelectTrigger><SelectContent><SelectItem value="none">بدون آزمون</SelectItem>{exams.data?.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.title} — {exam.jalali_date}</SelectItem>)}</SelectContent></Select></FormField><FormField label="درس مرتبط" hint="اختیاری" error={form.formState.errors.subject_exam_id?.message}><Select value={subjectExamId || "none"} disabled={!selectedExam} onValueChange={(value) => form.setValue("subject_exam_id", value === "none" ? "" : value)}><SelectTrigger><SelectValue placeholder="بدون درس" /></SelectTrigger><SelectContent><SelectItem value="none">بدون درس</SelectItem>{selectedExam?.subjects?.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.subject_name}</SelectItem>)}</SelectContent></Select></FormField><FormField label="شماره سؤال" error={form.formState.errors.question_number?.message} required><Input type="number" min={1} {...form.register("question_number", { valueAsNumber: true })} /></FormField><FormField label="دسته‌بندی اشتباه" hint="مثلاً بی‌دقتی یا ضعف مفهومی" error={form.formState.errors.category?.message} required><Input {...form.register("category")} /></FormField></div><FormField label="یادداشت و راه‌حل صحیح" error={form.formState.errors.notes?.message}><Textarea {...form.register("notes")} rows={5} /></FormField><DynamicFieldsSection fields={dynamicFields.data ?? []} values={dynamicValues} errors={dynamicErrors} disabled={save.isPending} onChange={(name, value) => { form.setValue("dynamic_fields", { ...dynamicValues, [name]: value }); setDynamicErrors((current) => ({ ...current, [name]: "" })); }} />{save.isError && <Alert variant="destructive"><AlertDescription>{save.error.message}</AlertDescription></Alert>}<div className="flex justify-end gap-2">{onCancel && <Button type="button" variant="ghost" onClick={onCancel}>انصراف</Button>}<Button type="submit" loading={save.isPending}><Save className="size-4" />{mistake ? "ذخیره ویرایش" : "ثبت اشتباه"}</Button></div></form>;
}
