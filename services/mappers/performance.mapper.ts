import { resolveUploadUrl } from "@/lib/upload-url";
import { parseStringArray } from "@/lib/safe-json";
import type { PerformanceHistory } from "@/types/performance";

export type PerformanceView = PerformanceHistory & { attachments: string[] };
export function mapPerformance(value: PerformanceHistory): PerformanceView { return { ...value, attachments: parseStringArray(value.files).map(resolveUploadUrl) }; }
export const mapPerformanceList = (values: PerformanceHistory[]) => values.map(mapPerformance);
