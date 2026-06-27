/**
 * @file services/api/performance.api.ts
 * @description API client for student performance report operations.
 *
 * Students have read-only access:
 *   mine()  — GET /students/performance; returns the student's performance records.
 *
 * Administrators have full CRUD:
 *   forStudent(id) — GET /admin/students/:id/performance
 *   create(id, input)   — POST /admin/students/:id/performance
 *   update(id, input)   — PUT /admin/performance/:id
 *   remove(id)          — DELETE /admin/performance/:id
 *
 * All responses are passed through the performance mapper which parses the JSON
 * files string into an attachments string[] with resolved same-origin URLs.
 */
import { apiRequest } from "./client";
import type {
  PerformanceHistory,
  PerformanceInput,
  PerformanceUpdateInput,
} from "@/types/performance";
import type { StatusResponse } from "@/types/api";
import { mapPerformance, mapPerformanceList } from "@/services/mappers/performance.mapper";
// Students have read-only access to performance reports. Create, update, and delete operations remain in administrator-scoped backend routes.
export const performanceApi = {
  mine: () => apiRequest<PerformanceHistory[]>("/students/performance").then(mapPerformanceList),
  forStudent: (id: string) =>
    apiRequest<PerformanceHistory[]>(`/admin/students/${id}/performance`).then(mapPerformanceList),
  create: (id: string, input: PerformanceInput) =>
    apiRequest<PerformanceHistory>(`/admin/students/${id}/performance`, {
      method: "POST",
      body: JSON.stringify(input),
    }).then(mapPerformance),
  update: (id: string, input: PerformanceUpdateInput) =>
    apiRequest<StatusResponse>(`/admin/performance/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiRequest<StatusResponse>(`/admin/performance/${id}`, { method: "DELETE" }),
};
