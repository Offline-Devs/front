import type { DynamicFieldDefinition } from "@/types/dynamic-field";
// تبدیل definitionهای backend به input مناسب و register کردن آن‌ها زیر dynamic_fields[name].
export function DynamicFieldRenderer({ field }: { field: DynamicFieldDefinition }) { return <div data-field-name={field.name}>{field.label}</div>; }
