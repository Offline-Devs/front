import { apiRequest } from "./client"; import type { SubjectConfig } from "@/types/subject";
// Reads public major and subject reference data used by profile and exam forms; these relatively static queries use long-lived cache keys.
export const subjectsApi = { majors: () => apiRequest<SubjectConfig[]>("/majors", { auth: false }), byMajor: (major: string) => apiRequest<SubjectConfig>(`/subjects?major=${encodeURIComponent(major)}`, { auth: false }) };
