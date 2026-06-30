/**
 * @file app/(admin)/admin/layout.tsx
 * @description Server layout that guards every admin route.
 *
 * Calls requireRole("admin") before rendering any child. If the session
 * is missing or the role is not "admin" the guard redirects to /login or
 * /forbidden respectively. On success wraps children in DashboardShell
 * with role="admin" to render the admin sidebar and header.
 */
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getBrandConfig } from "@/config/branding";
import { requireRole } from "@/lib/server/auth-guard";
// The admin shell executes the server-side role guard before rendering navigation or any privileged child route.
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("admin");
  return (
    <DashboardShell role="admin" brand={getBrandConfig()}>
      {children}
    </DashboardShell>
  );
}
