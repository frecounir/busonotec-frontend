import type { BusinessEntity, CreateEntityInput } from "../types";
import { apiClient } from "./httpClient";

const ENTITY_ERROR_MESSAGE =
  "No fue posible completar la solicitud de entidades.";

export function getEntities(): Promise<BusinessEntity[]> {
  return apiClient.get<BusinessEntity[]>(
    "/business-entities",
    ENTITY_ERROR_MESSAGE,
  );
}

export function getEntityById(id: string): Promise<BusinessEntity> {
  return apiClient.get<BusinessEntity>(
    `/business-entities/${id}`,
    ENTITY_ERROR_MESSAGE,
  );
}

export function createEntity(data: CreateEntityInput): Promise<BusinessEntity> {
  return apiClient.post<BusinessEntity>(
    "/business-entities",
    data,
    ENTITY_ERROR_MESSAGE,
  );
}

export function deleteEntity(id: string): Promise<void> {
  return apiClient.delete<void>(
    `/business-entities/${id}`,
    ENTITY_ERROR_MESSAGE,
  );
}
