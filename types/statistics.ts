/**
 * @file types/statistics.ts
 * @description TypeScript types for exam statistics and dashboard summary data.
 *
 * All types are consumed by the statistics dashboard components and mirror the
 * Go backend's ExamStatistics and DashboardSummary response shapes.
 *
 * ExamStatistics   — aggregate returned by GET /students/statistics and
 *                    GET /admin/students/:id/statistics. Includes subject-level
 *                    accuracy, trend data, and mistake categorisation.
 * DashboardSummary — lightweight summary returned by GET /students/dashboard.
 *                    The is_approved field is used by the StudentDashboard to
 *                    conditionally show the approval-pending banner.
 * StatisticsFilters — optional from/to Jalali date strings passed as query params.
 */
// Defines the aggregate, trend, subject, and mistake-reason data returned by the backend statistics handler and consumed by both charts and accessible tables.
export type SubjectStatistics = {
  subject_name: string;
  total_questions: number;
  correct: number;
  wrong: number;
  blank: number;
  percentage: number;
};
export type TrendPoint = { date: string; jalali_date: string; score: number; exam_count: number };
export type ExamStatistics = {
  total_exams: number;
  average_score: number;
  subject_stats: SubjectStatistics[];
  trend_data: TrendPoint[];
  mistakes_by_reason: Record<string, number>;
};
export type DashboardSummary = {
  total_exams: number;
  total_mistakes: number;
  average_score: number;
  recent_exams: import("./exam").Exam[];
  is_approved: boolean;
  has_study_plan: boolean;
};
export type StatisticsFilters = { from?: string; to?: string };
