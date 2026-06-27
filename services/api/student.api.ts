/**
 * @file services/api/student.api.ts
 * @description API client for the current student's own profile operations.
 *
 * getProfile()      — GET /students/profile; returns the authenticated student's
 *   full profile including the is_approved flag. Used by ProfileAvatar,
 *   ExamForm (for the student's major), and ApprovalGuard.
 *
 * saveProfile(input) — POST /students/profile; creates or updates the student's
 *   profile. The backend uses the same endpoint for both create and update,
 *   distinguished by whether a student record already exists for the user_id.
 *   Does NOT reset is_approved on update — the backend explicitly excludes
 *   that field from its update map.
 */
import { apiRequest } from "./client";
import type { Student, StudentProfileInput } from "@/types/student";
// Manages the current student's profile. The backend intentionally uses the same POST endpoint for initial creation and subsequent updates.
export const studentApi = {
  getProfile: () => apiRequest<Student>("/students/profile"),
  saveProfile: (input: StudentProfileInput) =>
    apiRequest<Student>("/students/profile", { method: "POST", body: JSON.stringify(input) }),
};
