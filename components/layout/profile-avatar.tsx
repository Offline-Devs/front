/**
 * @file components/layout/profile-avatar.tsx
 * @description User profile avatar for the dashboard header.
 *
 * For students: fetches the profile photo URL from the student profile query
 * and renders a circular image with a link to /profile. Falls back to a
 * UserRound icon when no photo is set.
 *
 * For admins: renders a ShieldCheck icon in a span (no link, since admins
 * don't have a profile page in this application).
 *
 * The profile query is only enabled for the "student" role to avoid redundant
 * fetches in the admin layout.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { queryKeys } from "@/services/api/query-keys";
import { studentApi } from "@/services/api/student.api";
import { resolveUploadUrl } from "@/lib/upload-url";

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
    <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-card bg-secondary text-primary shadow-[0_0_0_2px_var(--primary)] transition-transform duration-200 hover:scale-105">
      {student?.profile_photo ? (
        <Image
          src={resolveUploadUrl(student.profile_photo)}
          alt={`تصویر پروفایل ${label}`}
          fill
          sizes="44px"
          className="object-cover"
          unoptimized
        />
      ) : role === "admin" ? (
        <ShieldCheck className="size-5" aria-hidden="true" />
      ) : (
        <UserRound className="size-5" aria-hidden="true" />
      )}
    </span>
  );

  return role === "student" ? (
    <Link href="/profile" aria-label={label} title={label} className="rounded-full">
      {content}
    </Link>
  ) : (
    <span aria-label="حساب مدیر" title="حساب مدیر">
      {content}
    </span>
  );
}
