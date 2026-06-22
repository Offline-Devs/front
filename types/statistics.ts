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
