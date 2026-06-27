/**
 * @file app/(auth)/complete-profile/page.tsx
 * @description Student profile completion page — step 3 of new-user onboarding.
 *
 * Server component that requires the student role (redirects to /login or
 * /forbidden otherwise) and then checks whether a profile already exists:
 *   - Profile exists and OK  → redirect to /dashboard (already onboarded)
 *   - Profile 403            → redirect to /forbidden (account suspended)
 *   - Profile 404 or error   → render ProfileForm in onboarding mode
 *
 * On form save, ProfileForm redirects to /dashboard and the student enters
 * the normal dashboard flow where ApprovalGuard checks is_approved.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { backendFetch } from "@/lib/server/backend-client";
import { requireRole } from "@/lib/server/auth-guard";

export const metadata: Metadata = {
  title: "تکمیل پروفایل",
  robots: { index: false, follow: false },
};

export default async function CompleteProfilePage() {
  const session = await requireRole("student");
  let profileResponse: Response | null = null;
  try {
    profileResponse = await backendFetch("/students/profile", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  } catch {
    // The form keeps its state and surfaces a retryable API error on submission.
  }
  if (profileResponse?.ok) redirect("/dashboard");
  if (profileResponse?.status === 403) redirect("/forbidden");

  return (
    <div className="grid gap-7">
      <header>
        <p className="text-sm font-bold text-primary">آخرین مرحله</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">تکمیل پروفایل دانش‌آموز</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          این اطلاعات برای شخصی‌سازی آزمون‌ها، گزارش پیشرفت و ارتباط مشاور با شما استفاده می‌شود.
        </p>
      </header>
      <ProfileForm onboarding />
    </div>
  );
}
