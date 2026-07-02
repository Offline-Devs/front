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
import { apiRequest, ApiError } from "./client";
import { env } from "@/config/env";
import type { UploadKind, UploadResponse } from "@/types/upload";

type UploadProgress = {
  loaded: number;
  total?: number;
  percent: number;
};
type UploadOptions = { onProgress?: (progress: UploadProgress) => void };

function headersFromRaw(value: string) {
  const headers = new Headers();
  value
    .trim()
    .split(/[\r\n]+/)
    .forEach((line) => {
      const index = line.indexOf(":");
      if (index > 0) headers.set(line.slice(0, index), line.slice(index + 1).trim());
    });
  return headers;
}

function parseJsonBody(value: string) {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function uploadRequest<T>(path: string, body: FormData, options: UploadOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${env.apiBasePath}${path}`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      const total = event.lengthComputable ? event.total : undefined;
      const percent = total ? Math.min(99, Math.round((event.loaded / total) * 100)) : 0;
      options.onProgress?.({ loaded: event.loaded, total, percent });
    };
    xhr.onload = () => {
      const headers = headersFromRaw(xhr.getAllResponseHeaders());
      const text = xhr.responseText;
      if (xhr.status >= 200 && xhr.status < 300) {
        options.onProgress?.({ loaded: 1, total: 1, percent: 100 });
        resolve(parseJsonBody(text) as T);
        return;
      }
      const parsed = parseJsonBody(text);
      const errorBody =
        parsed &&
        typeof parsed === "object" &&
        "error" in parsed &&
        typeof (parsed as { error: unknown }).error === "string"
          ? { error: (parsed as { error: string }).error }
          : { error: "unknown network error" };
      reject(new ApiError(xhr.status, errorBody, headers));
    };
    xhr.onerror = () => reject(new Error("ارتباط با سرور برقرار نشد."));
    xhr.ontimeout = () => reject(new Error("بارگذاری فایل بیش از حد طول کشید."));
    xhr.send(body);
  });
}

// Builds multipart upload requests. Browser validation improves UX, while the BFF and backend enforce upload type, count, and size limits.
export const uploadApi = {
  one: (file: File, type: UploadKind, options?: UploadOptions) => {
    const body = new FormData();
    body.append("file", file);
    if (options?.onProgress)
      return uploadRequest<UploadResponse>(`/upload?type=${type}`, body, options);
    return apiRequest<UploadResponse>(`/upload?type=${type}`, { method: "POST", body });
  },
  multiple: (files: File[], type: UploadKind, options?: UploadOptions) => {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    if (options?.onProgress)
      return uploadRequest<UploadResponse[]>(`/upload/multiple?type=${type}`, body, options);
    return apiRequest<UploadResponse[]>(`/upload/multiple?type=${type}`, { method: "POST", body });
  },
};
