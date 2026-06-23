"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DynamicFieldsSection } from "@/components/forms/dynamic-fields-section";
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
import { FileUploader } from "@/components/upload/file-uploader";
import {
  profileSchema,
  type ProfileFormOutput,
  type ProfileFormValues,
} from "@/schemas/profile.schema";
import { invalidation, invalidateDependencies } from "@/services/api/invalidation";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";
import { subjectsApi } from "@/services/api/subjects.api";
import { dynamicFieldsApi } from "@/services/api/dynamic-fields.api";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";
import type { Student } from "@/types/student";
import { validateDynamicFieldValues } from "@/lib/dynamic-fields";
import { notifyFormErrors, notifyValidationMessage } from "@/lib/form-notifications";

type ProfileFormProps = {
  profile?: Student;
  dynamicFields?: DynamicFieldDefinition[];
  onboarding?: boolean;
};

export function ProfileForm({ profile, dynamicFields = [], onboarding = false }: ProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});
  const form = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      city: profile?.city ?? "",
      jalali_birth_date: profile?.jalali_birth_date ?? "",
      school: profile?.school ?? "",
      major: profile?.major ?? "",
      profile_photo: profile?.profile_photo ?? "",
      dynamic_fields: profile?.dynamic_fields ?? {},
    },
  });
  const majors = useQuery({
    queryKey: queryKeys.majors,
    queryFn: subjectsApi.majors,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const runtimeFields = useQuery({
    queryKey: ["dynamic-fields", "student"],
    queryFn: () => dynamicFieldsApi.list("student"),
    retry: false,
    staleTime: 300_000,
  });
  const resolvedDynamicFields = dynamicFields.length ? dynamicFields : (runtimeFields.data ?? []);
  const saveProfile = useMutation({
    meta: {
      successMessage: onboarding ? "پروفایل تکمیل شد؛ خوش آمدید." : "تغییرات پروفایل ذخیره شد.",
    },
    mutationFn: studentApi.saveProfile,
    onSuccess: async (savedProfile) => {
      queryClient.setQueryData(queryKeys.profile, savedProfile);
      await invalidateDependencies(queryClient, invalidation.profile);
      if (onboarding) router.replace("/dashboard");
      router.refresh();
    },
  });
  const dynamicValues = useWatch({ control: form.control, name: "dynamic_fields" });
  const profilePhoto = useWatch({ control: form.control, name: "profile_photo" });
  const selectedMajor = useWatch({ control: form.control, name: "major" });
  const selectedBirthDate = useWatch({ control: form.control, name: "jalali_birth_date" });

  function submit(values: ProfileFormOutput) {
    const errors = validateDynamicFieldValues(resolvedDynamicFields, values.dynamic_fields);
    setDynamicErrors(errors);
    if (Object.keys(errors).length > 0) {
      notifyValidationMessage(Object.values(errors)[0]);
      return;
    }
    saveProfile.mutate(values);
  }

  return (
    <form className="grid gap-7" noValidate onSubmit={form.handleSubmit(submit, notifyFormErrors)}>
      <section className="grid gap-4" aria-labelledby="identity-heading">
        <div>
          <h2 id="identity-heading" className="font-bold">
            اطلاعات هویتی
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            اطلاعات را مطابق مشخصات واقعی خود وارد کنید.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="نام" error={form.formState.errors.first_name?.message} required>
            <Input {...form.register("first_name")} autoComplete="given-name" autoFocus />
          </FormField>
          <FormField label="نام خانوادگی" error={form.formState.errors.last_name?.message} required>
            <Input {...form.register("last_name")} autoComplete="family-name" />
          </FormField>
          <FormField
            label="تاریخ تولد شمسی"
            hint="تاریخ را از تقویم انتخاب کنید."
            error={form.formState.errors.jalali_birth_date?.message}
            required
          >
            <JalaliDatePicker
              value={selectedBirthDate}
              purpose="birth"
              title="انتخاب تاریخ تولد"
              placeholder="انتخاب تاریخ تولد"
              onChange={(value) =>
                form.setValue("jalali_birth_date", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
          </FormField>
          <FormField label="شهر" error={form.formState.errors.city?.message} required>
            <Input {...form.register("city")} autoComplete="address-level2" />
          </FormField>
        </div>
      </section>

      <section className="grid gap-4 border-t pt-6" aria-labelledby="education-heading">
        <div>
          <h2 id="education-heading" className="font-bold">
            اطلاعات تحصیلی
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            رشته در ساخت آزمون‌ها و گزارش‌ها استفاده می‌شود.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="مدرسه" error={form.formState.errors.school?.message} required>
            <Input {...form.register("school")} />
          </FormField>
          {majors.data?.length ? (
            <FormField label="رشته تحصیلی" error={form.formState.errors.major?.message} required>
              <Select
                value={selectedMajor}
                onValueChange={(value) => form.setValue("major", value, { shouldValidate: true })}
              >
                <SelectTrigger aria-label="رشته تحصیلی">
                  <SelectValue placeholder="انتخاب رشته" />
                </SelectTrigger>
                <SelectContent>
                  {majors.data.map(({ major }) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          ) : (
            <FormField
              label="رشته تحصیلی"
              hint={
                majors.isError
                  ? "فهرست رشته‌ها در دسترس نیست؛ نام رشته را وارد کنید."
                  : "در حال دریافت رشته‌ها…"
              }
              error={form.formState.errors.major?.message}
              required
            >
              <Input {...form.register("major")} disabled={majors.isLoading} />
            </FormField>
          )}
        </div>
      </section>

      <section className="grid gap-4 border-t pt-6" aria-labelledby="photo-heading">
        <div>
          <h2 id="photo-heading" className="font-bold">
            عکس پروفایل
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            این بخش اختیاری است و بعداً قابل تغییر خواهد بود.
          </p>
        </div>
        <FileUploader
          value={profilePhoto}
          disabled={saveProfile.isPending}
          onChange={(url) => form.setValue("profile_photo", url, { shouldDirty: true })}
        />
      </section>

      <DynamicFieldsSection
        fields={resolvedDynamicFields}
        values={dynamicValues}
        errors={dynamicErrors}
        disabled={saveProfile.isPending}
        onChange={(name, value) => {
          form.setValue(
            "dynamic_fields",
            { ...dynamicValues, [name]: value },
            { shouldDirty: true },
          );
          setDynamicErrors((current) => ({ ...current, [name]: "" }));
        }}
      />

      {saveProfile.isError && (
        <Alert variant="destructive">
          <AlertDescription>{saveProfile.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
        {!onboarding && (
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            انصراف
          </Button>
        )}
        <Button type="submit" size="lg" loading={saveProfile.isPending}>
          {!saveProfile.isPending && <Save className="size-4" aria-hidden="true" />}
          {onboarding ? "ثبت و ورود به پنل" : "ذخیره تغییرات"}
        </Button>
      </div>
    </form>
  );
}
