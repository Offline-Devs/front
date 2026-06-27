/**
 * @file services/mappers/performance.mapper.ts
 * @description Normalises raw PerformanceHistory API responses.
 *
 * mapPerformance(value) — parses the backend's `files` JSON string into a
 *   typed string[] of attachment URLs. Each relative path is resolved through
 *   resolveUploadUrl so the browser fetches via the same-origin BFF proxy.
 *   Returns a PerformanceView which extends PerformanceHistory with an
 *   `attachments` field; the raw `files` string is preserved unchanged.
 *
 * mapPerformanceList — maps an array through mapPerformance.
 */
import { resolveUploadUrl } from "@/lib/upload-url";
import { parseStringArray } from "@/lib/safe-json";
import type { PerformanceHistory } from "@/types/performance";

type PerformanceView = PerformanceHistory & { attachments: string[] };
export function mapPerformance(value: PerformanceHistory): PerformanceView {
  return { ...value, attachments: parseStringArray(value.files).map(resolveUploadUrl) };
}
export const mapPerformanceList = (values: PerformanceHistory[]) => values.map(mapPerformance);
