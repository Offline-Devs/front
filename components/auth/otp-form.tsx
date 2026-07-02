/**
 * @file components/auth/otp-form.tsx
 * @description Login step 2: six-digit OTP verification form.
 *
 * Reads the pending phone from sessionStorage. If absent, immediately redirects
 * back to /login so the form is never shown in an inconsistent state.
 *
 * Key behaviours:
 *   - Six individual digit inputs with keyboard navigation (ArrowLeft/Right,
 *     Backspace focus movement) and paste support for both ASCII and Persian digits.
 *   - On successful OTP verification, checks whether a student profile exists
 *     (GET /students/profile) and routes to /dashboard (profile found) or
 *     /complete-profile (404 — new user onboarding). Admins always go to /admin.
 *   - On 401 error, clears the digit inputs so the student can retry.
 *   - Resend OTP button with a countdown timer (env.otpResendSeconds).
 *   - Displays the mock OTP code in a warning banner when running against the
 *     development backend with EXPOSE_MOCK_OTP=true.
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
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
import { notifyFormErrors } from "@/lib/form-notifications";
import { otpSchema, type OtpFormOutput, type OtpFormValues } from "@/schemas/auth.schema";
import { ApiError } from "@/services/api/client";
import { authApi } from "@/services/api/auth.api";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";
import { useAuthStore } from "@/stores/auth-store";

const OTP_LENGTH = 6;
type SubmitMode = "auto" | "manual";

export function OtpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const lastAutoSubmittedCodeRef = useRef("");
  const lastSubmissionModeRef = useRef<SubmitMode>("manual");
  const [phone, setPhone] = useState<string | null>(null);
  const [digits, setDigits] = useState(() => Array<string>(OTP_LENGTH).fill(""));
  const [remainingSeconds, setRemainingSeconds] = useState(env.otpResendSeconds);
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const [manualVerificationError, setManualVerificationError] = useState<string | null>(null);
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
    meta: { successMessage: "با موفقیت وارد حساب شدید." },
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
      const isManualSubmission = lastSubmissionModeRef.current === "manual";
      if (isManualSubmission) {
        setManualVerificationError(
          error instanceof Error ? error.message : "خطای پیش‌بینی‌نشده‌ای رخ داد.",
        );
      }

      if (error instanceof ApiError && error.status === 401) {
        lastAutoSubmittedCodeRef.current = "";
        if (!isManualSubmission) return;
        setDigits(Array<string>(OTP_LENGTH).fill(""));
        form.setValue("code", "");
        inputRefs.current[0]?.focus();
      }
    },
  });

  const resendOtp = useMutation({
    meta: { successMessage: "کد تأیید دوباره ارسال شد." },
    mutationFn: () => authApi.requestOtp({ phone: phone! }),
    onSuccess: (response) => {
      savePendingPhone(phone!, response.otp);
      setDevelopmentOtp(response.otp ?? null);
      setRemainingSeconds(env.otpResendSeconds);
      lastAutoSubmittedCodeRef.current = "";
      setManualVerificationError(null);
      setDigits(Array<string>(OTP_LENGTH).fill(""));
      form.setValue("code", "");
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 429) {
        setRemainingSeconds(Math.max(1, error.retryAfterSeconds ?? env.otpResendSeconds));
      }
    },
  });

  function submitCompletedCode(code: string, mode: SubmitMode) {
    if (!phone || code.length !== OTP_LENGTH || verifyOtp.isPending) return;
    if (mode === "auto" && lastAutoSubmittedCodeRef.current === code) return;

    if (mode === "auto") lastAutoSubmittedCodeRef.current = code;
    lastSubmissionModeRef.current = mode;
    setManualVerificationError(null);
    form.clearErrors("code");
    if (verifyOtp.isError) verifyOtp.reset();
    verifyOtp.mutate({ phone, code });
  }

  function updateDigits(nextDigits: string[], shouldSubmit = false) {
    setDigits(nextDigits);
    const code = nextDigits.join("");
    form.setValue("code", code, { shouldValidate: code.length === OTP_LENGTH });

    if (code.length < OTP_LENGTH) {
      lastAutoSubmittedCodeRef.current = "";
      setManualVerificationError(null);
      if (verifyOtp.isError) verifyOtp.reset();
      return;
    }
    if (shouldSubmit) submitCompletedCode(code, "auto");
  }

  function applyDigits(startIndex: number, value: string) {
    const normalized = normalizeNumericInput(value).replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!normalized) return;

    const nextDigits = normalized.length >= OTP_LENGTH ? Array<string>(OTP_LENGTH).fill("") : [...digits];
    const offset = normalized.length >= OTP_LENGTH ? 0 : startIndex;

    normalized.split("").forEach((digit, index) => {
      const targetIndex = offset + index;
      if (targetIndex < OTP_LENGTH) nextDigits[targetIndex] = digit;
    });

    updateDigits(nextDigits, true);

    const nextEmptyIndex = nextDigits.findIndex((digit) => !digit);
    const focusIndex =
      nextEmptyIndex === -1 ? OTP_LENGTH - 1 : Math.min(nextEmptyIndex, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  function handleDigitChange(index: number, value: string) {
    const normalized = normalizeNumericInput(value).replace(/\D/g, "");
    if (normalized.length > 1) {
      applyDigits(index, normalized);
      return;
    }

    const digit = normalized.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateDigits(nextDigits, true);
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

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement | HTMLDivElement>) {
    const pasted = normalizeNumericInput(event.clipboardData.getData("text")).replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    event.stopPropagation();
    applyDigits(index, pasted);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void form.handleSubmit(
      (values) => submitCompletedCode(values.code, "manual"),
      notifyFormErrors,
    )(event);
  }

  if (!phone) return <div className="h-56 animate-pulse rounded-md bg-muted" />;

  return (
    <form
      className="grid gap-5"
      aria-label="فرم کد تأیید"
      noValidate
      onSubmit={handleFormSubmit}
    >
      <p className="text-sm leading-6 text-muted-foreground">
        کد ۶ رقمی ارسال‌شده به{" "}
        <bdi dir="ltr" className="font-bold text-foreground">
          {phone}
        </bdi>{" "}
        را وارد کنید.
      </p>

      <div dir="ltr" className="flex justify-center gap-2" onPaste={(event) => handlePaste(0, event)}>
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(element: HTMLInputElement | null) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => handleDigitChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
            aria-label={`رقم ${index + 1} کد تأیید`}
            className="otp-input size-12 px-0 text-center text-xl font-bold sm:size-14"
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

      {manualVerificationError && (
        <Alert variant="destructive">
          <AlertDescription>{manualVerificationError}</AlertDescription>
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
