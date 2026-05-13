import type { EntityField } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error("No fue posible completar la solicitud de campos.");
  }

  return response.json() as Promise<T>;
}

export type CreateFieldInput = {
  name: string;
  type: string;
  businessEntityId: string;
};

export function getFields(entityId: string): Promise<EntityField[]> {
  return request<EntityField[]>(`/entities/${entityId}/fields`);
}

export function createField(data: CreateFieldInput): Promise<EntityField> {
  return request<EntityField>("/fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
