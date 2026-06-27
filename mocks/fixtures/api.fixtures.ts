/**
 * @file mocks/fixtures/api.fixtures.ts
 * @description Typed API response fixtures used across unit, component, and E2E tests.
 *
 * All fixtures use stable UUIDs and a fixed createdAt/updatedAt timestamp to
 * keep snapshot output deterministic. Production code must never import this
 * module — it is test-only and may expose internal structure that the real
 * API would omit.
 *
 * Exports: userFixture, studentFixture, examFixture, performanceFixture,
 *          blogPostFixture, dynamicFieldFixture.
 */
import type { BlogPost } from "@/types/blog";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";
import type { Exam } from "@/types/exam";
import type { PerformanceHistory } from "@/types/performance";
import type { Student, User } from "@/types/student";

const createdAt = "2026-06-21T08:00:00Z";
const updatedAt = "2026-06-21T08:30:00Z";

// Typed response fixtures cover the API families exercised by unit, component, and integration tests without requiring a live backend.
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

const subjectExamFixture = {
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
  negative_mark: 0.33,
  total_subjects: 1,
  dynamic_fields: {},
  created_at: createdAt,
  updated_at: updatedAt,
  subjects: [subjectExamFixture],
} satisfies Exam;

export const performanceFixture = {
  id: "66666666-6666-4666-8666-666666666666",
  student_id: studentFixture.id,
  date: "2026-06-21T00:00:00Z",
  jalali_date: "1405/03/31",
  notes: "تمرکز روی مرور اشتباهات هفته قبل.",
  study_plan: "روزانه دو ساعت زیست و یک ساعت شیمی.",
  files: '["/uploads/document/plan.pdf"]',
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies PerformanceHistory;

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
  options: '["دهم","یازدهم","دوازدهم"]',
  is_required: true,
  is_active: true,
  created_at: createdAt,
  updated_at: updatedAt,
} satisfies DynamicFieldDefinition;
