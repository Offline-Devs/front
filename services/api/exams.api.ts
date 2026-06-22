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
