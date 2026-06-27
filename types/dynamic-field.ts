/**
 * @file types/dynamic-field.ts
 * @description TypeScript types for admin-defined dynamic field definitions.
 *
 * Administrators create DynamicFieldDefinition records to add custom fields to
 * student profiles, exams, or mistakes without requiring a schema migration.
 *
 * The `options` field is a JSON string on the backend (e.g. '["option A","option B"]').
 * The dynamic-field mapper (services/mappers/dynamic-field.mapper.ts) parses this
 * into parsedOptions: string[] before components receive the definition.
 *
 * DynamicFieldInput is the create/update payload; it omits is_active (which the
 * backend manages) and the read-only timestamp/id fields.
 */
// Select options are stored by the backend as a JSON string. The shared renderer parses them defensively and falls back to an empty option set on malformed data.
export type DynamicFieldType = "text" | "number" | "select" | "checkbox" | "date";
export type DynamicFieldDefinition = {
  id: string;
  entity_type: string;
  name: string;
  label: string;
  field_type: DynamicFieldType;
  options?: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type DynamicFieldInput = Omit<
  DynamicFieldDefinition,
  "id" | "is_active" | "created_at" | "updated_at"
>;
