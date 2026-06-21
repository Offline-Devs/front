import { DashboardShell } from "@/components/layout/dashboard-shell";
// پوسته role=student؛ guard نهایی باید کاربر مهمان/مدیر و پروفایل ناقص را redirect کند.
export default function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <DashboardShell role="student">{children}</DashboardShell>; }
