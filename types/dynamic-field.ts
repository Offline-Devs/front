// Select options are stored by the backend as a JSON string. The shared renderer parses them defensively and falls back to an empty option set on malformed data.
export type DynamicFieldType = "text" | "number" | "select" | "checkbox" | "date";
export type DynamicFieldDefinition = { id: string; entity_type: string; name: string; label: string; field_type: DynamicFieldType; options?: string; is_required: boolean; is_active: boolean; created_at: string; updated_at: string };
export type DynamicFieldInput = Omit<DynamicFieldDefinition, "id" | "is_active" | "created_at" | "updated_at">;
