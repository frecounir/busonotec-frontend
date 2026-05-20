import type { EntityField } from "../types";
import { API_BASE_URL } from "./apiConfig";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error("No fue posible completar la solicitud de campos.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type CreateFieldInput = {
  name: string;
  type: string;
  businessEntityId: string;
};

export function getFields(entityId: string): Promise<EntityField[]> {
  return request<EntityField[]>(`/entity-fields/${entityId}`);
}

export function createField(data: CreateFieldInput): Promise<EntityField> {
  return request<EntityField>("/entity-fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteField(id: string): Promise<void> {
  return request<void>(`/entity-fields/${id}`, {
    method: "DELETE",
  });
}
