import { apiRequest } from "./client";
import type { Student, StudentProfileInput } from "@/types/student";
// Manages the current student's profile. The backend intentionally uses the same POST endpoint for initial creation and subsequent updates.
export const studentApi = {
  getProfile: () => apiRequest<Student>("/students/profile"),
  saveProfile: (input: StudentProfileInput) =>
    apiRequest<Student>("/students/profile", { method: "POST", body: JSON.stringify(input) }),
};
