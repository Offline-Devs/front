/**
 * @file services/api/query-keys.ts
 * @description Centralised TanStack Query key factories for the entire application.
 *
 * Using factory functions for parameterised keys (exam, statistics, adminStudent…)
 * ensures that:
 *  1. Cache lookups, invalidations, and prefetches all use the exact same key
 *     shape — no typo-induced mismatches between pages and mutations.
 *  2. Partial key invalidations (e.g. invalidating all admin/students/* queries
 *     with ["admin", "students"]) work because every specific key starts with
 *     the same prefix array.
 *  3. Test code can import the same factories instead of duplicating key strings.
 *
 * Rule: never construct a query key inline in a component or hook. Always import
 * and call the appropriate factory from this file.
 */
export const queryKeys = {
  session: ["session"] as const,
  profile: ["profile"] as const,
  exams: ["exams"] as const,
  exam: (id: string) => ["exams", id] as const,
  mistakes: ["mistakes"] as const,
  performance: ["performance"] as const,
  notifications: ["notifications"] as const,
  statistics: (filters?: object) => ["statistics", filters ?? {}] as const,
  dashboard: ["dashboard"] as const,
  majors: ["majors"] as const,
  blog: ["blog"] as const,
  blogPost: (slug: string) => ["blog", slug] as const,
  adminStudents: (filters?: object) => ["admin", "students", filters ?? {}] as const,
  adminStudent: (id: string) => ["admin", "students", id] as const,
  dynamicFields: (entity?: string) => ["admin", "dynamic-fields", entity ?? "all"] as const,
};
