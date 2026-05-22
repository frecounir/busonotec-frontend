import type { CreateFieldInput, EntityField } from "../types";
import { apiClient } from "./httpClient";

const FIELD_ERROR_MESSAGE = "No fue posible completar la solicitud de campos.";

export function getFields(entityId: string): Promise<EntityField[]> {
  return apiClient.get<EntityField[]>(
    `/entity-fields/${entityId}`,
    FIELD_ERROR_MESSAGE,
  );
}

export function createField(data: CreateFieldInput): Promise<EntityField> {
  return apiClient.post<EntityField>(
    "/entity-fields",
    data,
    FIELD_ERROR_MESSAGE,
  );
}

export function deleteField(id: string): Promise<void> {
  return apiClient.delete<void>(`/entity-fields/${id}`, FIELD_ERROR_MESSAGE);
}
