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
    <nav aria-label="ناوبری پنل" className="grid gap-1">
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
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
              active && "bg-accent text-accent-foreground",
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
