export type DynamicValues = Record<string, unknown>;

// User and Student mirror the backend JSON models at the API boundary. Backend timestamps remain ISO strings until a presentation formatter renders them.
export type User = { id: string; phone: string; role: "student" | "admin"; is_active: boolean; created_at: string; updated_at: string; student?: Student };
export type Student = { id: string; user_id: string; first_name: string; last_name: string; city: string; birth_date: string; jalali_birth_date: string; school: string; major: string; profile_photo: string; is_approved: boolean; approval_date?: string; dynamic_fields: DynamicValues; created_at: string; updated_at: string; user?: User };
export type StudentProfileInput = Pick<Student, "first_name" | "last_name" | "city" | "jalali_birth_date" | "school" | "major" | "profile_photo" | "dynamic_fields"> & { birth_date?: string };
export type StudentUpdateInput = Partial<Pick<Student, "first_name" | "last_name" | "city" | "school" | "major" | "is_approved">>;
export type StudentWithStats = Student & { exam_count: number; mistake_count: number };
