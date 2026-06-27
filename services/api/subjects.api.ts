/**
 * @file services/api/subjects.api.ts
 * @description API client for public academic major and subject reference data.
 *
 * majors()         — GET /majors; returns all configured major/subject pairs.
 *   Used by ProfileForm to populate the major dropdown.
 * byMajor(major)   — GET /subjects?major=…; returns the subject list for a
 *   specific major. Used by ExamForm to populate the subject dropdown.
 *
 * Both endpoints are public (no authentication required) and use long-lived
 * cache times (staleTime: 86_400_000 ms = 24 h) since this data changes rarely.
 */
import { apiRequest } from "./client";
import type { SubjectConfig } from "@/types/subject";
// Reads public major and subject reference data used by profile and exam forms; these relatively static queries use long-lived cache keys.
export const subjectsApi = {
  majors: () => apiRequest<SubjectConfig[]>("/majors", { auth: false }),
  byMajor: (major: string) =>
    apiRequest<SubjectConfig>(`/subjects?major=${encodeURIComponent(major)}`, { auth: false }),
};
