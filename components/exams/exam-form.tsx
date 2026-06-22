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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSchema, type ExamFormOutput, type ExamFormValues } from "@/schemas/exam.schema";
import { examsApi } from "@/services/api/exams.api";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { queryKeys } from "@/services/api/query-keys";
import { subjectsApi } from "@/services/api/subjects.api";
import type { Exam } from "@/types/exam";
import { DynamicFieldsSection } from "@/components/forms/dynamic-fields-section";
import { dynamicFieldsApi } from "@/services/api/dynamic-fields.api";
import { validateDynamicFieldValues } from "@/lib/dynamic-fields";

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
      major: exam?.major ?? "",
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
  const major = useWatch({ control: form.control, name: "major" });
  const watchedSubjects = useWatch({ control: form.control, name: "subjects" });
  const dynamicValues = useWatch({ control: form.control, name: "dynamic_fields" });
  const examDate = useWatch({ control: form.control, name: "jalali_date" });
  const majors = useQuery({
    queryKey: queryKeys.majors,
    queryFn: subjectsApi.majors,
    staleTime: 86_400_000,
  });
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
    mutationFn: (values: ExamFormOutput) => {
      const input = { ...values, total_subjects: values.subjects.length };
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
    if (!Object.keys(errors).length) save.mutate(values);
  }
  return (
    <form className="grid gap-6" noValidate onSubmit={form.handleSubmit(submit)}>
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
        <FormField label="رشته" error={form.formState.errors.major?.message} required>
          {majors.data?.length ? (
            <Select
              value={major}
              onValueChange={(value) => form.setValue("major", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب رشته" />
              </SelectTrigger>
              <SelectContent>
                {majors.data.map((item) => (
                  <SelectItem key={item.major} value={item.major}>
                    {item.major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input {...form.register("major")} />
          )}
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
        <Button type="submit" size="lg" loading={save.isPending}>
          <Save className="size-4" />
          {exam ? "ذخیره ویرایش" : "ثبت آزمون"}
        </Button>
      </div>
    </form>
  );
}
