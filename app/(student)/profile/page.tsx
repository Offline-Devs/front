/**
 * @file app/(student)/profile/page.tsx
 * @description Student profile view and edit page.
 *
 * Server component. Fetches the student's current profile directly from
 * the backend (authoritative data for the form's initial values), then
 * renders ProfileForm in edit mode alongside the approval status badge.
 *
 * This page is accessible regardless of approval status — the ApprovalGuard
 * in the student layout exempts the /profile path so students can update
 * their details while waiting for admin approval.
 */
import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";
import { backendFetch } from "@/lib/server/backend-client";
import { readSession } from "@/lib/server/session";
import type { Student } from "@/types/student";
export const metadata: Metadata = { title: "پروفایل من" };
export default async function ProfilePage() {
  const session = await readSession();
  if (!session) return null;
  const response = await backendFetch("/students/profile", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (!response.ok) throw new Error("دریافت پروفایل ناموفق بود.");
  const profile = (await response.json()) as Student;
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">پروفایل من</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            اطلاعات فردی و تحصیلی خود را به‌روز نگه دارید.
          </p>
        </div>
        <Badge variant={profile.is_approved ? "success" : "warning"}>
          {profile.is_approved ? "تأییدشده" : "در انتظار تأیید"}
        </Badge>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
