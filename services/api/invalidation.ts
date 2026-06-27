/**
 * @file services/api/invalidation.ts
 * @description Centralised TanStack Query cache invalidation dependency map.
 *
 * The `invalidation` object maps domain actions to the ordered list of query
 * keys that must be refetched when that action succeeds. This keeps mutation
 * onSuccess handlers thin and prevents accidental omission of related views.
 *
 * invalidateDependencies(client, keys) — helper that fans out all provided
 * keys to queryClient.invalidateQueries in parallel. Used by every mutation
 * onSuccess throughout the application.
 *
 * Key design decisions:
 *  - exam invalidation also includes dashboard and statistics so summary cards
 *    update without a manual reload after adding or removing an exam.
 *  - adminStudent invalidation includes admin dashboard counts so the approval
 *    status badges and pending-count cards in AdminDashboard stay accurate
 *    after any approval, revocation, or deletion action.
 *  - profile invalidation cascades to the dashboard so the is_approved state
 *    seen by the ApprovalGuard component reflects the latest server value.
 */
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

export const invalidation = {
  profile: [queryKeys.profile, queryKeys.dashboard],
  exam: [queryKeys.exams, queryKeys.dashboard, ["statistics"]],
  mistake: [queryKeys.mistakes, queryKeys.dashboard, ["statistics"]],
  performance: [queryKeys.performance, queryKeys.dashboard],
  adminDashboard: [
    ["admin", "dashboard", "all"],
    ["admin", "dashboard", "approved"],
    ["admin", "dashboard", "pending"],
  ],
  adminStudent: (id: string) =>
    [
      ["admin", "students"],
      queryKeys.adminStudent(id),
      ["admin", "students", id, "statistics"],
      ["admin", "dashboard", "all"],
      ["admin", "dashboard", "approved"],
      ["admin", "dashboard", "pending"],
    ] as QueryKey[],
  blog: [queryKeys.blog, ["admin", "blog"]],
  dynamicFields: [["admin", "dynamic-fields"]],
} satisfies Record<string, QueryKey[] | ((id: string) => QueryKey[])>;

export async function invalidateDependencies(client: QueryClient, keys: QueryKey[]) {
  await Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })));
}
