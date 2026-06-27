/**
 * @file lib/safe-json.ts
 * @description Safe JSON parsing utility for backend-stored string arrays.
 *
 * parseStringArray(value) — parses a JSON string and returns a string[] filtered
 *   to only string elements. Returns an empty array for null/undefined input,
 *   invalid JSON, or non-array parsed values. Used to safely decode the `files`
 *   field of PerformanceHistory and the `options` field of DynamicFieldDefinition,
 *   both of which are stored as JSON strings in the backend database.
 */
export function parseStringArray(value?: string | null) {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}
