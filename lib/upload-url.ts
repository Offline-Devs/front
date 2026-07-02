/**
 * @file lib/upload-url.ts
 * @description Resolves backend upload paths to same-origin BFF URLs.
 *
 * resolveUploadUrl(value) — if value is an absolute HTTP/HTTPS URL it is returned
 *   unchanged. Otherwise the value is treated as a backend-relative path (e.g.
 *   "/uploads/profile/photo.jpg") and prefixed with env.apiBasePath so the browser
 *   fetches through the same-origin BFF proxy rather than directly hitting the
 *   backend host. This ensures upload URLs respect the application's reverse proxy
 *   configuration without hardcoding any origin.
 */
import { env } from "@/config/env";

// Relative backend upload paths are routed through the same-origin gateway; already validated absolute URLs are preserved unchanged.
export function resolveUploadUrl(value: string) {
  if (/^(https?:\/\/|blob:|data:)/i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${env.apiBasePath}${normalized}`;
}
