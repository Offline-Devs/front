import { apiRequest } from "./client";
import type { Student, StudentProfileInput } from "@/types/student";
// پروفایل کاربر جاری؛ POST هم create و هم update انجام می‌دهد.
export const studentApi = { getProfile: () => apiRequest<Student>("/students/profile"), saveProfile: (input: StudentProfileInput) => apiRequest<Student>("/students/profile", { method: "POST", body: JSON.stringify(input) }) };
