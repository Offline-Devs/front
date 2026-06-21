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
    <div className="mx-auto grid max-w-md gap-7">
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
