import type { Metadata } from "next";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
export const metadata: Metadata = { title: "داشبورد" };
export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">داشبورد دانش‌آموز</h1>
        <p className="mt-2 text-sm text-muted-foreground">خلاصه وضعیت و آخرین فعالیت‌های شما.</p>
      </div>
      <StudentDashboard />
    </div>
  );
}
