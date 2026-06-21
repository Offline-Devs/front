import { apiRequest } from "./client"; import type { DashboardSummary, ExamStatistics, StatisticsFilters } from "@/types/statistics";
const query = (filters: StatisticsFilters) => new URLSearchParams(Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1]))).toString();
// آمار، روند و summary داشبورد؛ پارامترهای واقعی backend از/to هستند.
export const statisticsApi = { get: (filters: StatisticsFilters = {}) => apiRequest<ExamStatistics>(`/students/statistics${query(filters) ? `?${query(filters)}` : ""}`), dashboard: () => apiRequest<DashboardSummary>("/students/dashboard"), adminStudent: (id: string, filters: StatisticsFilters = {}) => apiRequest<ExamStatistics>(`/admin/students/${id}/statistics${query(filters) ? `?${query(filters)}` : ""}`) };
