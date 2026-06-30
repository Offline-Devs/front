/**
 * @file components/layout/dashboard-shell.tsx
 * @description Persistent dashboard layout shell shared by student and admin roles.
 *
 * Renders a responsive two-column grid:
 *   Left column (lg+): DashboardSidebar — sticky sidebar with brand logo and
 *     role-specific navigation links.
 *   Right column: DashboardHeader (sticky top bar with profile avatar, logout,
 *     and mobile drawer trigger) + main content area with PageBreadcrumbs.
 *
 * The `role` prop switches navigation items, header labels, and profile avatar
 * behaviour between student and admin views.
 */
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { PageBreadcrumbs } from "./page-breadcrumbs";
import type { BrandConfig } from "@/config/branding";

export function DashboardShell({
  children,
  role,
  brand,
}: Readonly<{ children: React.ReactNode; role: "student" | "admin"; brand: BrandConfig }>) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <DashboardSidebar role={role} brand={brand} />
      <div className="min-w-0">
        <DashboardHeader role={role} brand={brand} />
        <main className="dashboard-content">
          <PageBreadcrumbs className="mb-6 rounded-lg border border-primary/10 bg-card px-4 py-3 shadow-[var(--shadow-sm)]" />
          {children}
        </main>
      </div>
    </div>
  );
}
