/**
 * @file components/layout/page-breadcrumbs.tsx
 * @description Automatic breadcrumb trail derived from the current URL path.
 *
 * Splits the pathname into segments and maps each to a Persian label using the
 * segmentLabels record. UUID-like and numeric segments are treated as entity
 * identifiers and labelled relative to their parent segment (e.g. a UUID after
 * "exams" becomes "جزئیات آزمون").
 *
 * Also renders a Back button that uses router.back() when browser history is
 * available, falling back to navigating to the parent path.
 *
 * Supports an optional currentLabel override to display a dynamic entity name
 * (e.g. the exam title) as the final breadcrumb.
 */
"use client";

import { ArrowRight, ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const segmentLabels: Record<string, string> = {
  about: "درباره ما",
  admin: "مدیریت",
  blog: "مقالات",
  "complete-profile": "تکمیل پروفایل",
  contact: "تماس با ما",
  dashboard: "داشبورد",
  "dynamic-fields": "فیلدهای سفارشی",
  edit: "ویرایش",
  exams: "آزمون‌ها",
  forbidden: "دسترسی غیرمجاز",
  login: "ورود",
  mistakes: "دفترچه اشتباهات",
  performance: "گزارش‌های عملکرد",
  profile: "پروفایل",
  services: "خدمات",
  statistics: "آمار و تحلیل",
  students: "دانش‌آموزان",
  "verify-otp": "تأیید کد ورود",
};

function isIdentifier(segment: string) {
  return /^\d+$/.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);
}

function segmentLabel(segment: string, previous?: string) {
  if (segment === "new") {
    if (previous === "exams") return "ثبت آزمون جدید";
    if (previous === "mistakes") return "ثبت اشتباه جدید";
    if (previous === "blog") return "ثبت مقاله جدید";
    if (previous === "performance") return "ثبت گزارش جدید";
    return "ثبت مورد جدید";
  }
  if (isIdentifier(segment) || (previous === "blog" && !segmentLabels[segment])) {
    if (previous === "exams") return "جزئیات آزمون";
    if (previous === "students") return "پرونده دانش‌آموز";
    if (previous === "blog") return "جزئیات مقاله";
  }
  return segmentLabels[segment] ?? decodeURIComponent(segment).replaceAll("-", " ");
}

function parentPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return "/";
  return `/${segments.slice(0, -1).join("/")}`;
}

export function PageBreadcrumbs({
  className,
  contained = false,
  currentLabel,
}: {
  className?: string;
  contained?: boolean;
  currentLabel?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    { href: "/", label: "خانه" },
    ...segments.map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label:
        index === segments.length - 1 && currentLabel
          ? currentLabel
          : segmentLabel(segment, segments[index - 1]),
    })),
  ];
  const isHome = pathname === "/";

  function goBack() {
    if (isHome) return;
    if (window.history.length > 1) router.back();
    else router.push(parentPath(pathname));
  }

  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between gap-3",
        contained && "page-container py-4",
        className,
      )}
    >
      <nav
        aria-label="مسیر صفحه"
        tabIndex={0}
        className="min-w-0 overflow-x-auto rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [scrollbar-width:none]"
      >
        <ol className="flex min-w-max items-center gap-1 text-sm">
          {crumbs.map((crumb, index) => {
            const current = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronLeft
                    className="size-4 shrink-0 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                )}
                {current ? (
                  <Link
                    href={crumb.href}
                    aria-current="page"
                    className="flex items-center gap-1.5 font-bold text-[var(--brand-strong)] transition-colors hover:text-primary"
                  >
                    {index === 0 && <Home className="size-4" aria-hidden="true" />}
                    {crumb.label}
                  </Link>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {index === 0 && <Home className="size-4" aria-hidden="true" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isHome}
        className="shrink-0"
        onClick={goBack}
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        بازگشت
      </Button>
    </div>
  );
}
