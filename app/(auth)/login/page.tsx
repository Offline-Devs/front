/**
 * @file app/(auth)/login/page.tsx
 * @description Phone number entry page — step 1 of the OTP login flow.
 *
 * Server component: if a valid session already exists the user is
 * redirected to /admin or /dashboard based on their role, so logged-in
 * users never see this page. Renders PhoneForm for unauthenticated visitors.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PhoneForm } from "@/components/auth/phone-form";
import { readSession } from "@/lib/server/session";

export const metadata: Metadata = {
  title: "ورود",
  description: "ورود امن با شماره موبایل و کد یک‌بارمصرف",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect(session.user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto grid max-w-md gap-5">
      <header className="text-center">
        <h1 className="text-2xl font-black sm:text-3xl">ورود به حساب کاربری</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          برای ورود یا ساخت حساب، شماره موبایل خود را وارد کنید.
        </p>
      </header>
      <PhoneForm />
    </div>
  );
}
