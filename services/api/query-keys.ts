// Central query-key factories create deterministic cache scopes so mutations invalidate only the affected entity lists, details, and summaries.
export const queryKeys = {
  session: ["session"] as const,
  profile: ["profile"] as const,
  exams: ["exams"] as const,
  exam: (id: string) => ["exams", id] as const,
  mistakes: ["mistakes"] as const,
  performance: ["performance"] as const,
  statistics: (filters?: object) => ["statistics", filters ?? {}] as const,
  dashboard: ["dashboard"] as const,
  majors: ["majors"] as const,
  blog: ["blog"] as const,
  blogPost: (slug: string) => ["blog", slug] as const,
  adminStudents: (filters?: object) => ["admin", "students", filters ?? {}] as const,
  adminStudent: (id: string) => ["admin", "students", id] as const,
  dynamicFields: (entity?: string) => ["admin", "dynamic-fields", entity ?? "all"] as const,
};
