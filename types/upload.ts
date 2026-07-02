/**
 * @file types/upload.ts
 * @description TypeScript types for file upload operations.
 *
 * UploadKind  — "profile" or "document"; passed as the ?type query parameter
 *   to the /upload endpoints and used by the BFF proxy to select the correct
 *   validation policy.
 * UploadResponse — returned by the Go backend after a successful upload.
 *   The url field is a backend-relative path that resolveUploadUrl converts
 *   to a same-origin BFF URL for browser display.
 */
// Describes single and batch upload responses. Relative URLs are resolved through the same-origin BFF so the browser never needs direct backend network access.
export type UploadKind = "profile" | "document";
export type UploadResponse = { url: string; filename: string; size: number };
