/**
 * @file services/mappers/dynamic-field.mapper.ts
 * @description Normalises DynamicFieldDefinition API responses.
 *
 * mapDynamicField(value) — parses the `options` JSON string into a
 *   parsedOptions: string[] using the safe JSON parser. Falls back to an empty
 *   array for malformed or absent options. The parsed array is used by
 *   DynamicFieldRenderer to populate select dropdowns.
 *
 * mapDynamicFieldList — maps an array through mapDynamicField.
 */
import { parseStringArray } from "@/lib/safe-json";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";

type DynamicFieldView = DynamicFieldDefinition & { parsedOptions: string[] };
export function mapDynamicField(value: DynamicFieldDefinition): DynamicFieldView {
  return { ...value, parsedOptions: parseStringArray(value.options) };
}
export const mapDynamicFieldList = (values: DynamicFieldDefinition[]) =>
  values.map(mapDynamicField);
