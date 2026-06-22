import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

export function DashboardShell({
  children,
  role,
}: Readonly<{ children: React.ReactNode; role: "student" | "admin" }>) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <DashboardSidebar role={role} />
      <div className="min-w-0">
        <DashboardHeader role={role} />
        <main>{children}</main>
      </div>
    </div>
  );
}
