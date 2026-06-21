import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/server/auth-guard";
// پوسته role=admin؛ guard باید role داخل session را قبل از نمایش محتوا بررسی کند.
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { await requireRole("admin"); return <DashboardShell role="admin">{children}</DashboardShell>; }
