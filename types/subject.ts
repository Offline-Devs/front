/**
 * @file types/subject.ts
 * @description TypeScript types for academic major and subject reference data.
 *
 * SubjectConfig is the payload returned by GET /majors and GET /subjects?major=…
 * Both endpoints are public (no authentication required) and serve relatively
 * static reference data consumed by profile and exam creation forms.
 *
 * These types are backend-managed; adding or changing available subjects requires
 * no frontend code change — the forms read them dynamically from the API.
 */
// Majors and subjects are backend-managed reference data. Forms consume these contracts instead of duplicating academic configuration in the UI.
export type SubjectConfig = { major: string; subjects: string[] };
