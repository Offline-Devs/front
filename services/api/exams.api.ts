/**
 * @file services/api/exams.api.ts
 * @description API client for the current student's exam CRUD operations.
 *
 * All requests go through the same-origin BFF proxy (/api/v1/*) which injects
 * the student's Bearer token from the encrypted session cookie.
 *
 * list()           — GET /exams; returns the full exam list with subjects.
 * get(id)          — GET /exams/:id; returns a single exam with mapped subjects.
 * create(input)    — POST /exams; creates a new exam with subjects.
 * update(id, input)— PUT /exams/:id; REPLACES the entire subject collection.
 * remove(id)       — DELETE /exams/:id; soft-deletes the exam.
 *
 * All responses are passed through mapExam / mapExamList from
 * services/mappers/exam.mapper.ts which normalises the negative_mark value,
 * pads Jalali dates, and calculates subject percentage scores.
 */
import { apiRequest } from "./client";
import type { Exam, ExamInput, ExamUpdateInput } from "@/types/exam";
import type { StatusResponse } from "@/types/api";
import { mapExam, mapExamList } from "@/services/mappers/exam.mapper";
// Provides current-student exam CRUD. Backend PUT semantics replace the complete subject collection, so edit forms always submit every retained subject row.
export const examsApi = {
  list: () => apiRequest<Exam[]>("/exams").then(mapExamList),
  get: (id: string) => apiRequest<Exam>(`/exams/${id}`).then(mapExam),
  create: (input: ExamInput) =>
    apiRequest<Exam>("/exams", { method: "POST", body: JSON.stringify(input) }).then(mapExam),
  update: (id: string, input: ExamUpdateInput) =>
    apiRequest<Exam>(`/exams/${id}`, { method: "PUT", body: JSON.stringify(input) }).then(mapExam),
  remove: (id: string) => apiRequest<StatusResponse>(`/exams/${id}`, { method: "DELETE" }),
};
