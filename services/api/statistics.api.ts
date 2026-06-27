/**
 * @file services/api/statistics.api.ts
 * @description API client for exam statistics and dashboard summary data.
 *
 * get(filters?)         — GET /students/statistics with optional Jalali from/to
 *                         date params. Returns ExamStatistics for the current student.
 * dashboard()           — GET /students/dashboard; lightweight DashboardSummary
 *                         including is_approved for the ApprovalGuard.
 * adminStudent(id, filters?) — GET /admin/students/:id/statistics; admin view of a
 *                         specific student's statistics.
 *
 * Both endpoints that accept date filters accept Jalali YYYY/MM/DD strings which
 * the backend converts to Gregorian for database range queries.
 */
import { apiRequest } from "./client";
import type { DashboardSummary, ExamStatistics, StatisticsFilters } from "@/types/statistics";
const query = (filters: StatisticsFilters) =>
  new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();
// Fetches dashboard summaries and detailed statistics. Optional `from` and `to` parameters map directly to backend Jalali date filters.
export const statisticsApi = {
  get: (filters: StatisticsFilters = {}) =>
    apiRequest<ExamStatistics>(`/students/statistics${query(filters) ? `?${query(filters)}` : ""}`),
  dashboard: () => apiRequest<DashboardSummary>("/students/dashboard"),
  adminStudent: (id: string, filters: StatisticsFilters = {}) =>
    apiRequest<ExamStatistics>(
      `/admin/students/${id}/statistics${query(filters) ? `?${query(filters)}` : ""}`,
    ),
};
