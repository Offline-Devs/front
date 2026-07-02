/**
 * @file app/(auth)/layout.tsx
 * @description Split-panel layout for all authentication flow pages.
 *
 * Left panel: brand logo, ThemeToggle, PageBreadcrumbs, and the page
 * content slot. Right panel (lg+ only): decorative illustration with an
 * overlay tagline, hidden on smaller screens.
 *
 * Used by /login, /verify-otp, and /complete-profile.
 */
import Image from "next/image";
import Link from "next/link";
import { getBrandConfig } from "@/config/branding";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = getBrandConfig();
  return (
    <main className="brand-grid min-h-screen bg-background p-3 sm:p-5 lg:grid lg:place-items-center">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-primary/10 bg-card shadow-[var(--shadow-lg)] sm:min-h-[calc(100vh-2.5rem)] lg:min-h-[min(760px,calc(100vh-3rem))] lg:grid-cols-[1fr_.9fr]">
        <div className="flex min-h-0 flex-col p-5 sm:p-8 lg:p-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 font-black text-[var(--brand-strong)]"
            >
              <BrandLogo priority label={brand.appName} />
              {brand.appShortName}
            </Link>
            <ThemeToggle />
          </div>
          <PageBreadcrumbs className="mb-5 border-b border-primary/10 pb-3" />
          <div className="pt-2 sm:pt-3 lg:pt-4">{children}</div>
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
          <div className="absolute inset-x-10 bottom-10 rounded-lg border border-border/60 bg-card/85 p-6 text-center shadow-[var(--shadow-md)] backdrop-blur">
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
