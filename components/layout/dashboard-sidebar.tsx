import Link from "next/link";
import type { BrandConfig } from "@/config/branding";
import { BrandLogo } from "@/components/ui/brand-logo";
import { DashboardNavigation } from "./dashboard-navigation";

export function DashboardSidebar({
  role,
  brand,
}: {
  role: "student" | "admin";
  brand: BrandConfig;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen border-e border-border/80 bg-card p-5 shadow-[var(--shadow-sm)] lg:flex lg:flex-col">
      <Link
        href={role === "admin" ? "/admin" : "/dashboard"}
        className="mb-8 flex min-h-12 items-center gap-3 rounded-md px-2 text-lg font-extrabold text-[var(--brand-strong)]"
      >
        <BrandLogo label={brand.appName} />
        <span>{brand.appShortName}</span>
      </Link>
      <DashboardNavigation role={role} />
      <div className="mt-auto rounded-lg border border-primary/10 bg-secondary/70 p-4 text-xs leading-6 text-muted-foreground">
        {role === "admin" ? "پنل مدیریت سامانه" : "پنل دانش آموز"}
        <br />
        نسخه <bdi dir="ltr">{brand.appVersion}</bdi>
      </div>
    </aside>
  );
}
