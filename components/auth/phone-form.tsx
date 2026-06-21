"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { savePendingPhone } from "@/lib/auth-flow";
import {
  phoneSchema,
  type PhoneFormOutput,
  type PhoneFormValues,
} from "@/schemas/auth.schema";
import { authApi } from "@/services/api/auth.api";

export function PhoneForm() {
  const router = useRouter();
  const form = useForm<PhoneFormValues, unknown, PhoneFormOutput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });
  const requestOtp = useMutation({
    mutationFn: authApi.requestOtp,
    onSuccess: (response, input) => {
      savePendingPhone(input.phone, response.otp);
      router.push("/verify-otp");
    },
  });

  return (
    <form
      className="grid gap-5"
      aria-label="فرم شماره موبایل"
      noValidate
      onSubmit={form.handleSubmit((values) => requestOtp.mutate(values))}
    >
      <FormField
        label="شماره موبایل"
        hint="شماره را با ۰۹ وارد کنید."
        error={form.formState.errors.phone?.message}
        required
      >
        <Input
          {...form.register("phone")}
          type="tel"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="0912 123 4567"
          className="text-left"
          autoFocus
        />
      </FormField>

      {requestOtp.isError && (
        <Alert variant="destructive">
          <AlertDescription>{requestOtp.error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" loading={requestOtp.isPending}>
        دریافت کد تأیید
        {!requestOtp.isPending && <ArrowLeft className="size-4" aria-hidden="true" />}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Smartphone className="size-4" aria-hidden="true" />
        کد یک‌بارمصرف برای همین شماره ارسال می‌شود.
      </p>
    </form>
  );
}
