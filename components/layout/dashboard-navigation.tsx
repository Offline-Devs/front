/**
 * @file components/layout/dashboard-navigation.tsx
 * @description Role-aware navigation link list for dashboard sidebar and mobile drawer.
 *
 * Renders navigation items from config/navigation.ts for the given role. The active
 * link is determined by comparing the current pathname with each item's href using
 * startsWith for nested routes, with an exact match for the root dashboard and admin
 * pages to avoid false positives.
 *
 * The optional onNavigate callback is used by the mobile drawer to close itself
 * after the user selects a navigation item.
 */
"use client";

import {
  BarChart3,
  BookOpenCheck,
  CircleUserRound,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  NotebookPen,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/cn";

const icons = {
  "/dashboard": Gauge,
  "/exams": BookOpenCheck,
  "/mistakes": NotebookPen,
  "/performance": FileText,
  "/statistics": BarChart3,
  "/profile": CircleUserRound,
  "/admin": LayoutDashboard,
  "/admin/students": UsersRound,
  "/admin/blog": FileText,
  "/admin/dynamic-fields": GraduationCap,
};

export function DashboardNavigation({
  role,
  onNavigate,
}: {
  role: "student" | "admin";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="ناوبری پنل" className="grid gap-1.5">
      {navigation[role].map((item) => {
        const Icon = icons[item.href];
        const active =
          item.href === (role === "admin" ? "/admin" : "/dashboard")
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-md px-3.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
              active &&
                "bg-primary text-primary-foreground shadow-sm hover:bg-[var(--brand-strong)] hover:text-primary-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
