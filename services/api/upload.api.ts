/**
 * @file services/api/upload.api.ts
 * @description API client for file upload operations.
 *
 * Upload endpoints are available to administrators and approved students.
 * Profile uploads remain image-only; document uploads are used for performance
 * report attachments and are limited by count/size rather than MIME type.
 *
 * one(file, type)        — POST /upload?type=profile|document (single file).
 * multiple(files, type)  — POST /upload/multiple?type=document (up to maxFiles).
 *
 * Browser-side validation improves UX. The BFF proxy and backend also enforce
 * upload type, count, and size limits.
 */
import { apiRequest } from "./client";
import type { UploadKind, UploadResponse } from "@/types/upload";
// Builds multipart upload requests. Browser validation improves UX, while the BFF and backend enforce upload type, count, and size limits.
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
