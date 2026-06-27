/**
 * @file app/(auth)/verify-otp/page.tsx
 * @description OTP code verification page — step 2 of the login flow.
 *
 * Server component: redirects already-authenticated users away. Renders
 * OtpForm which reads the pending phone number from sessionStorage, verifies
 * the OTP, and routes the user to /dashboard, /admin, or /complete-profile
 * depending on their role and whether a student profile exists.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/auth/otp-form";
import { readSession } from "@/lib/server/session";

export const metadata: Metadata = {
  title: "تأیید شماره موبایل",
  robots: { index: false, follow: false },
};

export default async function VerifyOtpPage() {
  const session = await readSession();
  if (session) redirect(session.user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto grid max-w-md gap-7">
      <header className="text-center">
        <h1 className="text-2xl font-black sm:text-3xl">تأیید شماره موبایل</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          کد تأیید زمان محدودی معتبر است و فقط یک بار قابل استفاده خواهد بود.
        </p>
      </header>
      <OtpForm />
    </div>
  );
}
