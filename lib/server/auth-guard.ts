/**
 * @file lib/server/auth-guard.ts
 * @description Server-side route-protection guards used exclusively in Next.js server layouts.
 *
 * Exports two async functions that run on the server before any child route
 * renders its content:
 *
 * requireRole(role)
 *   Reads the encrypted BFF session cookie. Redirects to /login when no valid
 *   session is present, and to /forbidden when the authenticated user's role does
 *   not match the required role. Returns the decoded session on success.
 *
 * requireStudentProfile()
 *   Extends requireRole("student") with a live backend check that the student
 *   profile record still exists. On 404 or any non-OK backend response the guard
 *   redirects to /forbidden — this covers the case where an administrator has
 *   deleted the student's profile while the session is still active, ensuring the
 *   student cannot access the dashboard in that state.
 *
 *   Important: new-user onboarding to /complete-profile is handled exclusively
 *   by the OTP login flow (components/auth/otp-form.tsx), which checks for a 404
 *   profile BEFORE the student ever reaches the student layout. Therefore it is
 *   safe and correct to treat every 404 inside this guard as "profile was deleted".
 *
 * Both functions are annotated with "server-only" to prevent accidental import
 * from client components.
 */
import "server-only";

import { redirect } from "next/navigation";
import type { UserRole } from "@/types/auth";
import { backendFetch } from "./backend-client";
import { readSession } from "./session";

/**
 * Verifies the session exists and matches the required role.
 * Redirects to /login or /forbidden when the check fails.
 */
export async function requireRole(role: UserRole) {
  const session = await readSession();
  if (!session) redirect(`/login?next=${role === "admin" ? "/admin" : "/dashboard"}`);
  if (session.user.role !== role) redirect("/forbidden");
  return session;
}

/**
 * Verifies the session is a valid student session AND that the student's
 * profile record still exists in the backend.
 *
 * Redirects to /forbidden when:
 *  - The session is missing or the role is not "student"
 *  - The backend returns any non-OK response for GET /students/profile
 *    (covers profile deletion by admin and account deactivation)
 *
 * Returns the session on success.
 */
export async function requireStudentProfile() {
  const session = await requireRole("student");
  let response: Response;
  try {
    response = await backendFetch("/students/profile", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  } catch {
    // Network / timeout error — allow the student through gracefully;
    // individual pages surface their own API error states.
    return session;
  }

  if (!response.ok) redirect("/forbidden");
  return session;
}
