import type { BusinessEntity } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error("No fue posible completar la solicitud de entidades.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type CreateEntityInput = {
  name: string;
  description?: string;
};

export function getEntities(): Promise<BusinessEntity[]> {
  return request<BusinessEntity[]>("/entities");
}

export function getEntityById(id: string): Promise<BusinessEntity> {
  return request<BusinessEntity>(`/entities/${id}`);
}

export function createEntity(data: CreateEntityInput): Promise<BusinessEntity> {
  return request<BusinessEntity>("/entities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteEntity(id: string): Promise<void> {
  return request<void>(`/entities/${id}`, {
    method: "DELETE",
  });
}
