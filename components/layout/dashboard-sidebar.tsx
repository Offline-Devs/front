import Link from "next/link";
import { env } from "@/config/env";
import { DashboardNavigation } from "./dashboard-navigation";

export function DashboardSidebar({ role }: { role: "student" | "admin" }) {
  return (
    <aside className="sticky top-0 hidden h-screen border-e bg-card p-4 lg:flex lg:flex-col">
      <Link
        href={role === "admin" ? "/admin" : "/dashboard"}
        className="mb-6 flex min-h-12 items-center rounded-md px-3 text-lg font-extrabold text-primary"
      >
        {env.appShortName}
      </Link>
      <DashboardNavigation role={role} />
      <div className="mt-auto rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground">
        {role === "admin" ? "پنل مدیریت سامانه" : "پنل دانش‌آموز"}
        <br />
        نسخه <bdi dir="ltr">{env.appVersion}</bdi>
      </div>
    </aside>
  );
}
