"use client";

import { Trash2 } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ExamFormValues } from "@/schemas/exam.schema";

type Props = {
  index: number;
  register: UseFormRegister<ExamFormValues>;
  errors?: FieldErrors<ExamFormValues["subjects"][number]>;
  subjectName: string;
  subjectOptions: string[];
  onSubjectChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export function SubjectScoreRow({ index, register, errors, subjectName, subjectOptions, onSubjectChange, onRemove, canRemove }: Props) {
  return (
    <fieldset className="grid gap-4 rounded-lg border bg-muted/30 p-4">
      <legend className="px-2 text-sm font-bold">درس {index + 1}</legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="نام درس" error={errors?.subject_name?.message} required>
          {subjectOptions.length ? (
            <Select value={subjectName} onValueChange={onSubjectChange}>
              <SelectTrigger aria-label="نام درس"><SelectValue placeholder="انتخاب درس" /></SelectTrigger>
              <SelectContent>{subjectOptions.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
            </Select>
          ) : <Input {...register(`subjects.${index}.subject_name`)} />}
        </FormField>
        {(["total_questions", "answered", "correct", "wrong", "blank"] as const).map((name) => {
          const labels = { total_questions: "تعداد سؤال", answered: "پاسخ‌داده‌شده", correct: "صحیح", wrong: "غلط", blank: "نزده" };
          return <FormField key={name} label={labels[name]} error={errors?.[name]?.message} required><Input type="number" min={0} inputMode="numeric" {...register(`subjects.${index}.${name}`, { valueAsNumber: true })} /></FormField>;
        })}
      </div>
      {canRemove && <Button type="button" variant="ghost" size="sm" className="w-fit text-destructive" onClick={onRemove}><Trash2 className="size-4" />حذف درس</Button>}
    </fieldset>
  );
}
