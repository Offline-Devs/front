import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

export function DashboardShell({
  children,
  role,
}: Readonly<{ children: React.ReactNode; role: "student" | "admin" }>) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <DashboardSidebar role={role} />
      <div className="min-w-0">
        <DashboardHeader role={role} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
