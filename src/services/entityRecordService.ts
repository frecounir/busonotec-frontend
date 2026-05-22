import type { EntityRecord, SaveEntityRecordInput } from "../types";
import { apiClient } from "./httpClient";

const RECORD_ERROR_MESSAGE =
  "No fue posible completar la solicitud de registros de la entidad.";

export function getEntityRecords(entityId: string): Promise<EntityRecord[]> {
  return apiClient.get<EntityRecord[]>(
    `/business-entities/${entityId}/records`,
    RECORD_ERROR_MESSAGE,
  );
}

export function createEntityRecord(
  entityId: string,
  data: SaveEntityRecordInput,
): Promise<EntityRecord> {
  return apiClient.post<EntityRecord>(
    `/business-entities/${entityId}/records`,
    data,
    RECORD_ERROR_MESSAGE,
  );
}

export function updateEntityRecord(
  entityId: string,
  recordId: string,
  data: SaveEntityRecordInput,
): Promise<EntityRecord> {
  return apiClient.patch<EntityRecord>(
    `/business-entities/${entityId}/records/${recordId}`,
    data,
    RECORD_ERROR_MESSAGE,
  );
}

export function deleteEntityRecord(
  entityId: string,
  recordId: string,
): Promise<void> {
  return apiClient.delete<void>(
    `/business-entities/${entityId}/records/${recordId}`,
    RECORD_ERROR_MESSAGE,
  );
}
