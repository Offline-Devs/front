import { parseStringArray } from "@/lib/safe-json";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";

type DynamicFieldView = DynamicFieldDefinition & { parsedOptions: string[] };
export function mapDynamicField(value: DynamicFieldDefinition): DynamicFieldView {
  return { ...value, parsedOptions: parseStringArray(value.options) };
}
export const mapDynamicFieldList = (values: DynamicFieldDefinition[]) =>
  values.map(mapDynamicField);
