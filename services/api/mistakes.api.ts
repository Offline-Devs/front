/**
 * @file services/api/mistakes.api.ts
 * @description API client for the current student's mistake notebook CRUD operations.
 *
 * list()           — GET /mistakes; returns all of the student's mistake records.
 * create(input)    — POST /mistakes; adds a new mistake entry.
 * update(id, input)— PUT /mistakes/:id; updates an existing mistake entry.
 * remove(id)       — DELETE /mistakes/:id; soft-deletes a mistake entry.
 *
 * All requests route through the BFF proxy which injects the session token.
 * The mistake form's Zod schema transforms empty exam_id / subject_exam_id
 * strings to undefined before sending, matching the backend's optional UUID fields.
 */
import { apiRequest } from "./client";
import type { Mistake, MistakeInput, MistakeUpdateInput } from "@/types/mistake";
import type { StatusResponse } from "@/types/api";
// Provides current-student mistake-notebook CRUD operations through authenticated same-origin BFF requests.
export const mistakesApi = {
  list: () => apiRequest<Mistake[]>("/mistakes"),
  create: (input: MistakeInput) =>
    apiRequest<Mistake>("/mistakes", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: MistakeUpdateInput) =>
    apiRequest<Mistake>(`/mistakes/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  remove: (id: string) => apiRequest<StatusResponse>(`/mistakes/${id}`, { method: "DELETE" }),
};
