import type { PaginatedResponse, StatusResponse } from "@/types/api";
import type { BackendAuthResponse, BackendRefreshResponse, OtpResponse, SessionResponse } from "@/types/auth";
import type { BlogPost } from "@/types/blog";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";
import type { Exam } from "@/types/exam";
import type { Mistake } from "@/types/mistake";
import type { PerformanceHistory } from "@/types/performance";
import type { DashboardSummary, ExamStatistics } from "@/types/statistics";
import type { Student, StudentWithStats, User } from "@/types/student";
import type { SubjectConfig } from "@/types/subject";
import type { UploadResponse } from "@/types/upload";

const createdAt = "2026-06-21T08:00:00Z";
const updatedAt = "2026-06-21T08:30:00Z";

// fixtureهای typed تمام خانواده‌های response برای تست component/integration و توسعه بدون backend.
export const userFixture = {
  id: "11111111-1111-4111-8111-111111111111",
  phone: "+989121234567",
  role: "student",
  is_active: true,
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies User;

export const studentFixture = {
  id: "22222222-2222-4222-8222-222222222222",
  user_id: userFixture.id,
  first_name: "سارا",
  last_name: "احمدی",
  city: "بابل",
  birth_date: "2008-03-20T00:00:00Z",
  jalali_birth_date: "1386/12/29",
  school: "دبیرستان نمونه",
  major: "تجربی",
  profile_photo: "/uploads/profile/student.webp",
  is_approved: true,
  approval_date: createdAt,
  dynamic_fields: { grade: "دوازدهم" },
  created_at: createdAt,
  updated_at: updatedAt,
  user: userFixture,
} satisfies Student;

export const subjectExamFixture = {
  id: "33333333-3333-4333-8333-333333333333",
  exam_id: "44444444-4444-4444-8444-444444444444",
  subject_name: "زیست‌شناسی",
  total_questions: 20,
  answered: 18,
  correct: 15,
  wrong: 3,
  blank: 2,
  percentage: 70,
};

export const examFixture = {
  id: subjectExamFixture.exam_id,
  student_id: studentFixture.id,
  title: "آزمون جامع خرداد",
  exam_date: "2026-06-21T00:00:00Z",
  jalali_date: "1405/03/31",
  major: "تجربی",
  total_subjects: 1,
  dynamic_fields: {},
  created_at: createdAt,
  updated_at: updatedAt,
  subjects: [subjectExamFixture],
} satisfies Exam;

export const mistakeFixture = {
  id: "55555555-5555-4555-8555-555555555555",
  student_id: studentFixture.id,
  exam_id: examFixture.id,
  subject_exam_id: subjectExamFixture.id,
  question_number: 8,
  category: "بی‌دقتی",
  notes: "صورت سؤال کامل خوانده نشد.",
  dynamic_fields: {},
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies Mistake;

export const performanceFixture = {
  id: "66666666-6666-4666-8666-666666666666",
  student_id: studentFixture.id,
  date: "2026-06-21T00:00:00Z",
  jalali_date: "1405/03/31",
  notes: "تمرکز روی مرور اشتباهات هفته قبل.",
  study_plan: "روزانه دو ساعت زیست و یک ساعت شیمی.",
  files: "[\"/uploads/document/plan.pdf\"]",
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies PerformanceHistory;

export const statisticsFixture = {
  total_exams: 4,
  average_score: 71.5,
  subject_stats: [{ subject_name: "زیست‌شناسی", total_questions: 80, correct: 60, wrong: 12, blank: 8, percentage: 70 }],
  trend_data: [{ date: "2026-06-21", jalali_date: "1405/03/31", score: 70, exam_count: 1 }],
  mistakes_by_reason: { "بی‌دقتی": 3 },
} satisfies ExamStatistics;

export const dashboardFixture = {
  total_exams: 4,
  total_mistakes: 7,
  average_score: 71.5,
  recent_exams: [examFixture],
  is_approved: true,
  has_study_plan: true,
} satisfies DashboardSummary;

export const blogPostFixture = {
  id: "77777777-7777-4777-8777-777777777777",
  title: "چگونه آزمون خود را تحلیل کنیم؟",
  slug: "تحلیل-آزمون",
  content: "<p>تحلیل منظم آزمون، مسیر پیشرفت را روشن می‌کند.</p>",
  author_id: userFixture.id,
  published: true,
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies BlogPost;

export const dynamicFieldFixture = {
  id: "88888888-8888-4888-8888-888888888888",
  entity_type: "student",
  name: "grade",
  label: "پایه تحصیلی",
  field_type: "select",
  options: "[\"دهم\",\"یازدهم\",\"دوازدهم\"]",
  is_required: true,
  is_active: true,
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies DynamicFieldDefinition;

export const majorsFixture = [{ major: "تجربی", subjects: ["زیست‌شناسی", "شیمی", "فیزیک", "ریاضی"] }] satisfies SubjectConfig[];
export const uploadFixture = { url: "/uploads/profile/student.webp", filename: "student.webp", size: 42_000 } satisfies UploadResponse;
export const otpFixture = { message: "otp sent", otp: "123456" } satisfies OtpResponse;
export const backendAuthFixture = { access_token: "fixture-access-token", refresh_token: "fixture-refresh-token", user: userFixture, expires_in: 3600 } satisfies BackendAuthResponse;
export const backendRefreshFixture = { access_token: "fixture-new-access-token", expires_in: 3600 } satisfies BackendRefreshResponse;
export const sessionFixture = { user: userFixture, expires_in: 3600 } satisfies SessionResponse;
export const studentWithStatsFixture = { ...studentFixture, exam_count: 4, mistake_count: 7 } satisfies StudentWithStats;
export const studentsPageFixture = { data: [studentWithStatsFixture], total: 1, page: 1, limit: 20 } satisfies PaginatedResponse<StudentWithStats>;
export const statusFixtures = {
  updated: { status: "updated" }, deleted: { status: "deleted" }, approved: { status: "approved" }, published: { status: "published" },
} satisfies Record<StatusResponse["status"], StatusResponse>;
export const healthFixture = { status: "ok" } as const;
