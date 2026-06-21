import { apiRequest } from "./client";
import { mapDynamicFieldList } from "@/services/mappers/dynamic-field.mapper";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";

// Requires a read-only authenticated backend endpoint; unavailable in the current backend contract.
export const dynamicFieldsApi = {
  list: (entityType: "student" | "exam" | "mistake") =>
    apiRequest<DynamicFieldDefinition[]>(`/dynamic-fields?entity_type=${entityType}`).then(mapDynamicFieldList),
};
