import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

// اسکلت مشترک پنل با navigation متفاوت برای student/admin.
export function DashboardShell({ children, role }: Readonly<{ children: React.ReactNode; role: "student" | "admin" }>) { return <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]"><DashboardSidebar role={role} /><div><DashboardHeader /><main>{children}</main></div></div>; }
