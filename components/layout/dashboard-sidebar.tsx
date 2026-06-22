import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { env } from "@/config/env";
import { DashboardNavigation } from "./dashboard-navigation";

export function DashboardSidebar({ role }: { role: "student" | "admin" }) {
  return (
    <aside className="sticky top-0 hidden h-screen border-e border-border/80 bg-card p-5 shadow-[var(--shadow-sm)] lg:flex lg:flex-col">
      <Link
        href={role === "admin" ? "/admin" : "/dashboard"}
        className="mb-8 flex min-h-12 items-center gap-3 rounded-md px-2 text-lg font-extrabold text-[var(--brand-strong)]"
      >
        <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="size-6" aria-hidden="true" />
        </span>
        <span>{env.appShortName}</span>
      </Link>
      <DashboardNavigation role={role} />
      <div className="mt-auto rounded-lg border border-primary/10 bg-secondary/70 p-4 text-xs leading-6 text-muted-foreground">
        {role === "admin" ? "پنل مدیریت سامانه" : "پنل دانش‌آموز"}
        <br />
        نسخه <bdi dir="ltr">{env.appVersion}</bdi>
      </div>
    </aside>
  );
}
