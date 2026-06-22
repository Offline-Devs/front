import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/server/auth-guard";
// The admin shell executes the server-side role guard before rendering navigation or any privileged child route.
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("admin");
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
