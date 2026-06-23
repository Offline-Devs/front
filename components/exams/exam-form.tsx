"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { SubjectScoreRow } from "./subject-score-row";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import { examSchema, type ExamFormOutput, type ExamFormValues } from "@/schemas/exam.schema";
import { examsApi } from "@/services/api/exams.api";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";
import { subjectsApi } from "@/services/api/subjects.api";
import type { Exam, ExamInput } from "@/types/exam";
import { DynamicFieldsSection } from "@/components/forms/dynamic-fields-section";
import { dynamicFieldsApi } from "@/services/api/dynamic-fields.api";
import { validateDynamicFieldValues } from "@/lib/dynamic-fields";
import { notifyFormErrors, notifyValidationMessage } from "@/lib/form-notifications";

const emptySubject = {
  subject_name: "",
  total_questions: 0,
  answered: 0,
  correct: 0,
  wrong: 0,
  blank: 0,
};

export function ExamForm({ exam }: { exam?: Exam }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});
  const form = useForm<ExamFormValues, unknown, ExamFormOutput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam?.title ?? "",
      jalali_date: exam?.jalali_date ?? "",
      negative_mark: exam?.negative_mark ?? 0.33,
      dynamic_fields: exam?.dynamic_fields ?? {},
      subjects: exam?.subjects?.length
        ? exam.subjects.map(
            ({ subject_name, total_questions, answered, correct, wrong, blank }) => ({
              subject_name,
              total_questions,
              answered,
              correct,
              wrong,
              blank,
            }),
          )
        : [{ ...emptySubject }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "subjects" });
  const watchedSubjects = useWatch({ control: form.control, name: "subjects" });
  const dynamicValues = useWatch({ control: form.control, name: "dynamic_fields" });
  const examDate = useWatch({ control: form.control, name: "jalali_date" });
  const profile = useQuery({
    queryKey: queryKeys.profile,
    queryFn: studentApi.getProfile,
    enabled: !exam,
    staleTime: 300_000,
  });
  const major = exam?.major ?? profile.data?.major ?? "";
  const subjectConfig = useQuery({
    queryKey: ["subjects", major],
    queryFn: () => subjectsApi.byMajor(major),
    enabled: Boolean(major),
    staleTime: 86_400_000,
  });
  const dynamicFields = useQuery({
    queryKey: ["dynamic-fields", "exam"],
    queryFn: () => dynamicFieldsApi.list("exam"),
    retry: false,
    staleTime: 300_000,
  });
  const save = useMutation({
    meta: { successMessage: exam ? "تغییرات آزمون ذخیره شد." : "آزمون جدید ثبت شد." },
    mutationFn: (values: ExamFormOutput) => {
      if (!major) throw new Error("رشته تحصیلی در پروفایل شما مشخص نشده است.");
      const input: ExamInput = {
        ...values,
        major,
        total_subjects: values.subjects.length,
      };
      return exam ? examsApi.update(exam.id, input) : examsApi.create(input);
    },
    onSuccess: async (saved) => {
      queryClient.setQueryData(queryKeys.exam(saved.id), saved);
      await invalidateDependencies(queryClient, invalidation.exam);
      router.replace(`/exams/${saved.id}`);
      router.refresh();
    },
  });

  function submit(values: ExamFormOutput) {
    const errors = validateDynamicFieldValues(dynamicFields.data ?? [], values.dynamic_fields);
    setDynamicErrors(errors);
    if (Object.keys(errors).length) {
      notifyValidationMessage(Object.values(errors)[0]);
      return;
    }
    save.mutate(values);
  }
  return (
    <form className="grid gap-6" noValidate onSubmit={form.handleSubmit(submit, notifyFormErrors)}>
      {exam && (
        <Alert variant="warning">
          <AlertDescription>
            با ذخیره ویرایش، فهرست درس‌های قبلی به‌طور کامل با این فهرست جایگزین می‌شود.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="عنوان آزمون" error={form.formState.errors.title?.message} required>
          <Input {...form.register("title")} placeholder="مثلاً آزمون جامع خرداد" autoFocus />
        </FormField>
        <FormField label="تاریخ شمسی" error={form.formState.errors.jalali_date?.message} required>
          <JalaliDatePicker
            value={examDate}
            title="انتخاب تاریخ آزمون"
            placeholder="انتخاب تاریخ آزمون"
            onChange={(value) =>
              form.setValue("jalali_date", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        </FormField>
        <FormField
          label="نمره منفی هر پاسخ غلط"
          hint="عددی بین صفر تا یک؛ برای مثال ۰٫۳۳"
          error={form.formState.errors.negative_mark?.message}
          required
        >
          <Input
            {...form.register("negative_mark", { valueAsNumber: true })}
            type="number"
            inputMode="decimal"
            min="0"
            max="1"
            step="0.01"
            dir="ltr"
          />
        </FormField>
      </div>
      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">نتیجه درس‌ها</h2>
            <p className="text-sm text-muted-foreground">
              صحیح + غلط = پاسخ‌داده‌شده و پاسخ‌داده‌شده + نزده = کل سؤال.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => append({ ...emptySubject })}>
            <Plus className="size-4" />
            افزودن درس
          </Button>
        </div>
        {fields.map((field, index) => (
          <SubjectScoreRow
            key={field.id}
            index={index}
            register={form.register}
            errors={form.formState.errors.subjects?.[index]}
            subjectName={watchedSubjects[index]?.subject_name ?? ""}
            subjectOptions={subjectConfig.data?.subjects ?? []}
            onSubjectChange={(value) =>
              form.setValue(`subjects.${index}.subject_name`, value, { shouldValidate: true })
            }
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
        {typeof form.formState.errors.subjects?.message === "string" && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.subjects.message}
          </p>
        )}
      </section>
      <DynamicFieldsSection
        fields={dynamicFields.data ?? []}
        values={dynamicValues}
        errors={dynamicErrors}
        disabled={save.isPending}
        onChange={(name, value) => {
          form.setValue("dynamic_fields", { ...dynamicValues, [name]: value });
          setDynamicErrors((current) => ({ ...current, [name]: "" }));
        }}
      />
      {save.isError && (
        <Alert variant="destructive">
          <AlertDescription>{save.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={save.isPending || (!exam && profile.isLoading)}>
          <Save className="size-4" />
          {exam ? "ذخیره ویرایش" : "ثبت آزمون"}
        </Button>
      </div>
    </form>
  );
}
