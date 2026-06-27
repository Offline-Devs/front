/**
 * @file types/student.ts
 * @description TypeScript types for User and Student entities at the API boundary.
 *
 * User and Student mirror the Go backend JSON models exactly. Timestamps remain
 * ISO 8601 strings until a presentation formatter renders them. The optional
 * `student` field on User is populated when the backend preloads the relation.
 *
 * DynamicValues   — a Record<string, unknown> for the JSONB dynamic_fields column
 *   shared by Student, Exam, and Mistake models.
 * StudentProfileInput — the subset of Student fields sent to POST /students/profile.
 * StudentUpdateInput  — the partial subset available to admins via PUT /admin/students/:id.
 * StudentWithStats    — extends Student with exam_count and mistake_count aggregates
 *   returned by GET /admin/students/with-stats.
 */
export type DynamicValues = Record<string, unknown>;

// User and Student mirror the backend JSON models at the API boundary. Backend timestamps remain ISO strings until a presentation formatter renders them.
export type User = {
  id: string;
  phone: string;
  role: "student" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  student?: Student;
};
export type Student = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  city: string;
  birth_date: string;
  jalali_birth_date: string;
  school: string;
  major: string;
  profile_photo: string;
  is_approved: boolean;
  approval_date?: string;
  dynamic_fields: DynamicValues;
  created_at: string;
  updated_at: string;
  user?: User;
};
export type StudentProfileInput = Pick<
  Student,
  | "first_name"
  | "last_name"
  | "city"
  | "jalali_birth_date"
  | "school"
  | "major"
  | "profile_photo"
  | "dynamic_fields"
>;
export type StudentUpdateInput = Partial<
  Pick<Student, "first_name" | "last_name" | "city" | "school" | "major" | "is_approved">
>;
export type StudentWithStats = Student & { exam_count: number; mistake_count: number };
