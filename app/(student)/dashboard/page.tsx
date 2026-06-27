/**
 * @file app/(student)/dashboard/page.tsx
 * @description Student dashboard page — the default landing after login.
 *
 * Server component. Renders StudentDashboard which fetches summary stats
 * and recent activity from the backend. The parent student layout's
 * ApprovalGuard intercepts rendering for unapproved students and replaces
 * this page content with a single approval-pending message, preventing
 * multiple API calls to approval-gated endpoints.
 */
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
