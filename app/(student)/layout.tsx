/**
 * @file app/(student)/layout.tsx
 * @description Server layout that wraps every student-protected route.
 *
 * Responsibilities (in order of execution):
 *
 * 1. Server-side guard — calls requireStudentProfile() before any child
 *    renders. This function verifies:
 *      a. A valid encrypted session cookie exists.
 *      b. The authenticated user's role is "student".
 *      c. The student's profile record still exists in the backend.
 *    If any check fails the guard redirects to /login or /forbidden before
 *    this layout sends any HTML to the browser.
 *
 * 2. Dashboard shell — wraps children in DashboardShell which renders the
 *    persistent sidebar navigation and the sticky header.
 *
 * 3. Approval guard — wraps children in ApprovalGuard, a client component
 *    that replaces page content with a single pending-approval message when
 *    the student's profile has not yet been approved by an administrator.
 *    This prevents multiple HTTP 403 error toasts from firing when a student
 *    accesses approval-restricted API endpoints before their profile is approved.
 */
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ApprovalGuard } from "@/components/auth/approval-guard";
import { requireStudentProfile } from "@/lib/server/auth-guard";

export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireStudentProfile();
  return (
    <DashboardShell role="student">
      <ApprovalGuard>{children}</ApprovalGuard>
    </DashboardShell>
  );
}
