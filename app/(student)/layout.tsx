import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireStudentProfile } from "@/lib/server/auth-guard";
// The student shell rejects guests and administrators and redirects incomplete student profiles before protected content is rendered.
export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) { await requireStudentProfile(); return <DashboardShell role="student">{children}</DashboardShell>; }
