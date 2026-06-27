/**
 * @file components/auth/approval-guard.tsx
 * @description Client-side approval status guard for the student dashboard shell.
 *
 * Problem this solves: When a student's profile exists but has not yet been
 * approved by an administrator, most student-area backend endpoints return
 * HTTP 403. Without a guard, every page would fire its own API calls, each
 * producing a separate 403 error toast — flooding the student with confusing
 * error messages.
 *
 * Solution: This component sits inside DashboardShell (so the header and
 * navigation are still visible) and intercepts page rendering before any
 * approval-restricted API call is made:
 *
 *  - While the profile is loading or erroring it passes children through so
 *    each page can show its own skeleton / error state.
 *  - On the /profile path it always passes children through so the student
 *    can update their information to expedite the approval process.
 *  - When profile.is_approved is false it replaces the page content with a
 *    single, clear Persian approval-pending message — no 403 flood.
 *  - When profile.is_approved is true it renders children normally.
 *
 * Data: The profile query key is shared with the rest of the app (queryKeys.profile),
 * so this component benefits from any data already in the TanStack Query cache.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Clock3 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";

/** Paths where children render regardless of approval status. */
const APPROVAL_EXEMPT_PATHS = ["/profile"];

type ApprovalGuardProps = { children: React.ReactNode };

export function ApprovalGuard({ children }: ApprovalGuardProps) {
  const pathname = usePathname();

  const profile = useQuery({
    queryKey: queryKeys.profile,
    queryFn: studentApi.getProfile,
    staleTime: 30_000,
    // Suppress the global error toast; this component handles the error state silently.
    meta: { suppressErrorToast: true },
  });

  // Pass through while data is in-flight or on error.
  // Each page component manages its own loading/error UI.
  if (profile.isLoading || profile.isError) {
    return <>{children}</>;
  }

  // The profile page is always accessible so the student can complete or
  // update their details even before admin approval.
  if (APPROVAL_EXEMPT_PATHS.some((exempt) => pathname.startsWith(exempt))) {
    return <>{children}</>;
  }

  // Single clear message for unapproved students — prevents multiple 403 toasts.
  if (profile.data && !profile.data.is_approved) {
    return (
      <div className="grid gap-6">
        <Alert variant="warning">
          <Clock3 className="size-4" aria-hidden="true" />
          <AlertTitle>در انتظار تأیید مدیر</AlertTitle>
          <AlertDescription>
            تا زمانی که مدیر پروفایل شما را تأیید نکند، به بخش‌های اصلی سامانه دسترسی ندارید.
            می‌توانید اطلاعات پروفایل خود را از بخش پروفایل تکمیل یا به‌روز کنید.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/profile">مشاهده و ویرایش پروفایل</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
