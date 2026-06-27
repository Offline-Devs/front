/**
 * @file services/api/admin.api.ts
 * @description API client for administrator student and dynamic-field operations.
 *
 * Student operations:
 *   students(filters)  — GET /admin/students/with-stats with pagination and
 *                        approval-status filter. Uses the with-stats endpoint
 *                        because it returns exam_count and mistake_count in a
 *                        single request.
 *   student(id)        — GET /admin/students/:id; full student detail.
 *   exams(id)          — GET /admin/students/:id/exams
 *   mistakes(id)       — GET /admin/students/:id/mistakes
 *   updateStudent(id)  — PUT /admin/students/:id (partial update, admin fields).
 *   approve(id)        — PUT /admin/students/:id/approve; sets is_approved = true.
 *   removeStudent(id)  — DELETE /admin/students/:id; soft-deletes the student record.
 *
 * Dynamic field operations:
 *   dynamicFields(entityType?) — GET /admin/dynamic-fields (optionally filtered).
 *   createField(input)         — POST /admin/dynamic-fields
 *   updateField(id, input)     — PUT /admin/dynamic-fields/:id
 *   removeField(id)            — DELETE /admin/dynamic-fields/:id
 *
 * All dynamic-field responses are passed through the dynamic-field mapper which
 * parses the options JSON string into a typed string array.
 */
import { apiRequest } from "./client";
import type { PaginatedResponse, StatusResponse } from "@/types/api";
import type { Student, StudentUpdateInput, StudentWithStats } from "@/types/student";
import type { Exam } from "@/types/exam";
import type { Mistake } from "@/types/mistake";
import type { DynamicFieldDefinition, DynamicFieldInput } from "@/types/dynamic-field";
import { mapDynamicField, mapDynamicFieldList } from "@/services/mappers/dynamic-field.mapper";
export type StudentFilters = { page?: number; limit?: number; approved?: boolean | "all" };
const params = (value: StudentFilters) =>
  new URLSearchParams(
    Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, String(item)]),
  ).toString();
// Groups administrator student and dynamic-field operations. Paginated screens use the with-statistics endpoint instead of the backend's capped basic student list.
export const adminApi = {
  students: (filters: StudentFilters = {}) =>
    apiRequest<PaginatedResponse<StudentWithStats>>(
      `/admin/students/with-stats?${params(filters)}`,
    ),
  student: (id: string) => apiRequest<Student>(`/admin/students/${id}`),
  exams: (id: string) => apiRequest<Exam[]>(`/admin/students/${id}/exams`),
  mistakes: (id: string) => apiRequest<Mistake[]>(`/admin/students/${id}/mistakes`),
  updateStudent: (id: string, input: StudentUpdateInput) =>
    apiRequest<StatusResponse>(`/admin/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  approve: (id: string) =>
    apiRequest<StatusResponse>(`/admin/students/${id}/approve`, { method: "PUT" }),
  removeStudent: (id: string) =>
    apiRequest<StatusResponse>(`/admin/students/${id}`, { method: "DELETE" }),
  dynamicFields: (entityType?: string) =>
    apiRequest<DynamicFieldDefinition[]>(
      `/admin/dynamic-fields${entityType ? `?entity_type=${encodeURIComponent(entityType)}` : ""}`,
    ).then(mapDynamicFieldList),
  createField: (input: DynamicFieldInput) =>
    apiRequest<DynamicFieldDefinition>("/admin/dynamic-fields", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(mapDynamicField),
  updateField: (id: string, input: DynamicFieldInput) =>
    apiRequest<StatusResponse>(`/admin/dynamic-fields/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  removeField: (id: string) =>
    apiRequest<StatusResponse>(`/admin/dynamic-fields/${id}`, { method: "DELETE" }),
};
