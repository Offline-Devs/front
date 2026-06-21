import { apiRequest } from "./client"; import type { SubjectConfig } from "@/types/subject";
// تنظیمات عمومی رشته/درس برای فرم پروفایل و آزمون.
export const subjectsApi = { majors: () => apiRequest<SubjectConfig[]>("/majors", { auth: false }), byMajor: (major: string) => apiRequest<SubjectConfig>(`/subjects?major=${encodeURIComponent(major)}`, { auth: false }) };
