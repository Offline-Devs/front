import { env } from "@/config/env";

// Relative backend upload paths are routed through the same-origin gateway; already validated absolute URLs are preserved unchanged.
export function resolveUploadUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${env.apiBasePath}${normalized}`;
}
