import type { EntityRecord, EntityRecordPayload } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(
      "The entity record service request could not be completed.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type SaveEntityRecordInput = EntityRecordPayload;

export function getEntityRecords(entityId: string): Promise<EntityRecord[]> {
  return request<EntityRecord[]>(`/entities/${entityId}/records`);
}

export function createEntityRecord(
  entityId: string,
  data: SaveEntityRecordInput,
): Promise<EntityRecord> {
  return request<EntityRecord>(`/entities/${entityId}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateEntityRecord(
  entityId: string,
  data: EntityRecord,
): Promise<EntityRecord> {
  return request<EntityRecord>(`/entities/${entityId}/records`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteEntityRecord(
  entityId: string,
  record: EntityRecord,
): Promise<void> {
  return request<void>(`/entities/${entityId}/records`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
}
