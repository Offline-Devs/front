import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

export const invalidation = {
  profile: [queryKeys.profile, queryKeys.dashboard],
  exam: [queryKeys.exams, queryKeys.dashboard, ["statistics"]],
  mistake: [queryKeys.mistakes, queryKeys.dashboard, ["statistics"]],
  performance: [queryKeys.performance, queryKeys.dashboard],
  adminStudent: (id: string) =>
    [
      ["admin", "students"],
      queryKeys.adminStudent(id),
      ["admin", "students", id, "statistics"],
    ] as QueryKey[],
  blog: [queryKeys.blog, ["admin", "blog"]],
  dynamicFields: [["admin", "dynamic-fields"]],
} satisfies Record<string, QueryKey[] | ((id: string) => QueryKey[])>;

export async function invalidateDependencies(client: QueryClient, keys: QueryKey[]) {
  await Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })));
}
