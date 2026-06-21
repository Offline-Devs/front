import { DashboardShell } from "@/components/layout/dashboard-shell";
// پوسته role=admin؛ guard باید role داخل session را قبل از نمایش محتوا بررسی کند.
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <DashboardShell role="admin">{children}</DashboardShell>; }
