/**
 * @file types/performance.ts
 * @description TypeScript types for PerformanceHistory entities (admin report records).
 *
 * The backend persists the `files` field as a JSON-encoded string array
 * (e.g. '["https://...","https://..."]'). Mappers in services/mappers/performance.mapper.ts
 * normalise this to a typed string[] in the PerformanceView shape before components
 * receive the data. Raw PerformanceHistory is only used at the API boundary.
 *
 * PerformanceInput  — payload for POST /admin/students/:id/performance (create).
 * PerformanceUpdateInput — partial payload for PUT /admin/performance/:id (update).
 */
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
  jalali_date: string;
  notes: string;
  study_plan: string;
  files: string;
};
export type PerformanceUpdateInput = Partial<
  Pick<PerformanceInput, "notes" | "study_plan" | "files">
>;
