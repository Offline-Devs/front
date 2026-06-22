import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { env } from "@/config/env";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="brand-grid min-h-screen bg-background p-4 sm:p-6 lg:grid lg:place-items-center">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white shadow-[var(--shadow-lg)] sm:min-h-0 lg:grid-cols-[1fr_.9fr]">
        <div className="flex flex-col p-6 sm:p-10 lg:p-14">
          <Link
            href="/"
            className="mb-10 flex w-fit items-center gap-3 font-black text-[var(--brand-strong)]"
          >
            <span className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            {env.appShortName}
          </Link>
          <PageBreadcrumbs className="mb-8 border-b border-primary/10 pb-4" />
          <div className="my-auto">{children}</div>
          <p className="mt-10 text-xs text-muted-foreground">ورود امن با کد یک‌بارمصرف</p>
        </div>
        <div className="relative hidden min-h-[680px] overflow-hidden bg-secondary lg:block">
          <Image
            src="/images/design/online-counseling.png"
            alt="مشاوره آنلاین تحصیلی"
            fill
            sizes="45vw"
            className="object-contain p-14"
            priority
          />
          <div className="absolute inset-x-10 bottom-10 rounded-lg border border-white/60 bg-white/85 p-6 text-center shadow-[var(--shadow-md)] backdrop-blur">
            <p className="text-xl font-black text-[var(--brand-strong)]">همراه مسیر پیشرفت شما</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              تحلیل آزمون، شناخت اشتباهات و برنامه‌ریزی دقیق در یک پنل یکپارچه
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
