import { apiRequest } from "./client";
import { mapDynamicFieldList } from "@/services/mappers/dynamic-field.mapper";
import type { DynamicFieldDefinition } from "@/types/dynamic-field";

export const dynamicFieldsApi = {
  list: (entityType: "student" | "exam" | "mistake") =>
    apiRequest<DynamicFieldDefinition[]>(
      `/dynamic-fields?entity_type=${encodeURIComponent(entityType)}`,
    ).then(mapDynamicFieldList),
};
