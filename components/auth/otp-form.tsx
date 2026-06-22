"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/config/env";
import {
  authDestination,
  clearPendingPhone,
  getDevelopmentOtp,
  getPendingPhone,
  normalizeNumericInput,
  savePendingPhone,
} from "@/lib/auth-flow";
import { otpSchema, type OtpFormOutput, type OtpFormValues } from "@/schemas/auth.schema";
import { ApiError } from "@/services/api/client";
import { authApi } from "@/services/api/auth.api";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";
import { useAuthStore } from "@/stores/auth-store";

const OTP_LENGTH = 6;

export function OtpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [digits, setDigits] = useState(() => Array<string>(OTP_LENGTH).fill(""));
  const [remainingSeconds, setRemainingSeconds] = useState(env.otpResendSeconds);
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const form = useForm<OtpFormValues, unknown, OtpFormOutput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { phone: "", code: "" },
  });

  useEffect(() => {
    const pendingPhone = getPendingPhone();
    if (!pendingPhone) {
      router.replace("/login");
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setPhone(pendingPhone);
      setDevelopmentOtp(getDevelopmentOtp());
      form.setValue("phone", pendingPhone);
      inputRefs.current[0]?.focus();
    });
    return () => {
      active = false;
    };
  }, [form, router]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = window.setInterval(
      () => setRemainingSeconds((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const verifyOtp = useMutation({
    mutationFn: async (values: OtpFormOutput) => {
      const session = await authApi.verifyOtp(values);
      if (session.user.role === "admin") {
        return { session, destination: authDestination("admin") };
      }

      try {
        await studentApi.getProfile();
        return { session, destination: authDestination("student", true) };
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return { session, destination: authDestination("student", false) };
        }
        throw error;
      }
    },
    onSuccess: ({ session, destination }) => {
      clearPendingPhone();
      setUser(session.user);
      queryClient.setQueryData(queryKeys.session, session);
      router.replace(destination);
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        setDigits(Array<string>(OTP_LENGTH).fill(""));
        form.setValue("code", "");
        inputRefs.current[0]?.focus();
      }
    },
  });

  const resendOtp = useMutation({
    mutationFn: () => authApi.requestOtp({ phone: phone! }),
    onSuccess: (response) => {
      savePendingPhone(phone!, response.otp);
      setDevelopmentOtp(response.otp ?? null);
      setRemainingSeconds(env.otpResendSeconds);
      setDigits(Array<string>(OTP_LENGTH).fill(""));
      form.setValue("code", "");
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 429) {
        setRemainingSeconds(env.otpResendSeconds);
      }
    },
  });

  function updateDigits(nextDigits: string[]) {
    setDigits(nextDigits);
    form.setValue("code", nextDigits.join(""), { shouldValidate: true });
  }

  function handleDigitChange(index: number, value: string) {
    const digit = normalizeNumericInput(value).replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateDigits(nextDigits);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (event.key === "ArrowRight" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = normalizeNumericInput(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const nextDigits = Array<string>(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    updateDigits(nextDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  }

  if (!phone) return <div className="h-56 animate-pulse rounded-md bg-muted" />;

  return (
    <form
      className="grid gap-5"
      aria-label="فرم کد تأیید"
      noValidate
      onSubmit={form.handleSubmit((values) => verifyOtp.mutate(values))}
    >
      <p className="text-sm leading-6 text-muted-foreground">
        کد ۶ رقمی ارسال‌شده به{" "}
        <bdi dir="ltr" className="font-bold text-foreground">
          {phone}
        </bdi>{" "}
        را وارد کنید.
      </p>

      <div dir="ltr" className="flex justify-center gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(element: HTMLInputElement | null) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => handleDigitChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`رقم ${index + 1} کد تأیید`}
            className="size-12 px-0 text-center text-xl font-bold sm:size-14"
          />
        ))}
      </div>
      {form.formState.errors.code?.message && (
        <p className="text-center text-xs text-destructive" role="alert">
          {form.formState.errors.code.message}
        </p>
      )}

      {developmentOtp && (
        <Alert variant="warning">
          <AlertTitle>محیط آزمایشی</AlertTitle>
          <AlertDescription>
            کد بازگشتی سرویس mock:{" "}
            <bdi dir="ltr" className="font-bold">
              {developmentOtp}
            </bdi>
          </AlertDescription>
        </Alert>
      )}

      {verifyOtp.isError && (
        <Alert variant="destructive">
          <AlertDescription>{verifyOtp.error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" loading={verifyOtp.isPending}>
        تأیید و ورود
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Button asChild variant="link" size="sm">
          <Link href="/login" onClick={clearPendingPhone}>
            <ArrowRight className="size-4" aria-hidden="true" />
            اصلاح شماره
          </Link>
        </Button>
        {remainingSeconds > 0 ? (
          <span className="text-muted-foreground" aria-live="polite">
            ارسال مجدد تا {remainingSeconds.toLocaleString("fa-IR")} ثانیه
          </span>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={resendOtp.isPending}
            onClick={() => resendOtp.mutate()}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            ارسال مجدد کد
          </Button>
        )}
      </div>

      {resendOtp.isError && (
        <p className="text-xs text-destructive" role="alert">
          {resendOtp.error.message}
        </p>
      )}
    </form>
  );
}
