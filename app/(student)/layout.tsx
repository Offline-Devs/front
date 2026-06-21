import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireStudentProfile } from "@/lib/server/auth-guard";
// پوسته role=student؛ guard نهایی باید کاربر مهمان/مدیر و پروفایل ناقص را redirect کند.
export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) { await requireStudentProfile(); return <DashboardShell role="student">{children}</DashboardShell>; }
