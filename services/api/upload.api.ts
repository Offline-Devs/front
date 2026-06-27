/**
 * @file services/api/upload.api.ts
 * @description API client for file upload operations.
 *
 * IMPORTANT: Both upload endpoints (/upload and /upload/multiple) are in the
 * backend's student-protected route group and require the "student" role.
 * These functions should only be called in student-facing components.
 * Admin components that need file references should use URL-based attachment
 * management (pasting external links) instead of calling these functions.
 *
 * one(file, type)        — POST /upload?type=profile|document (single file).
 * multiple(files, type)  — POST /upload/multiple?type=document (up to maxFiles).
 *
 * Browser-side validation (MIME type, count, size) is performed before the
 * request is sent. The BFF proxy and backend perform independent validation
 * as a defence-in-depth measure.
 */
import { apiRequest } from "./client";
import type { UploadKind, UploadResponse } from "@/types/upload";
// Builds multipart upload requests. Browser validation improves UX, while the BFF and backend independently enforce MIME, signature, count, and size limits.
export const uploadApi = {
  one: (file: File, type: UploadKind) => {
    const body = new FormData();
    body.append("file", file);
    return apiRequest<UploadResponse>(`/upload?type=${type}`, { method: "POST", body });
  },
  multiple: (files: File[], type: UploadKind) => {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    return apiRequest<UploadResponse[]>(`/upload/multiple?type=${type}`, { method: "POST", body });
  },
};
