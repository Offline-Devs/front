/**
 * @file components/layout/profile-avatar.tsx
 * @description User profile avatar for the dashboard header.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ProfilePhotoPreview } from "@/components/shared/profile-photo-preview";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";

export function ProfileAvatar({ role }: { role: "student" | "admin" }) {
  const profile = useQuery({
    queryKey: queryKeys.profile,
    queryFn: studentApi.getProfile,
    enabled: role === "student",
    staleTime: 300_000,
  });
  const student = profile.data;
  const label = student ? `${student.first_name} ${student.last_name}`.trim() : "پروفایل کاربری";
  const content = (
    <ProfilePhotoPreview
      src={student?.profile_photo}
      label={role === "admin" ? "حساب مدیر" : label}
      fallback={role}
      className="transition-transform duration-200 hover:scale-105"
    />
  );

  return content;
}
