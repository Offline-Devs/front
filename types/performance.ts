// The backend persists `files` as a JSON-array string. Mappers normalize that storage detail into typed attachment arrays before components receive the record.
export type PerformanceHistory = {
  id: string;
  student_id: string;
  date: string;
  jalali_date: string;
  notes: string;
  files?: string;
  study_plan?: string;
  created_at: string;
  updated_at: string;
};
export type PerformanceInput = {
  date?: string;
  jalali_date: string;
  notes: string;
  study_plan: string;
  files: string;
};
export type PerformanceUpdateInput = Partial<
  Pick<PerformanceInput, "notes" | "study_plan" | "files">
>;
