import { request } from './apiClient'
import type { Entity } from '../types'

export async function fetchEntities(): Promise<Entity[]> {
  return request<Entity[]>('/api/schema/tables')
}

export async function createEntity(payload: { name: string; description?: string }): Promise<Entity> {
  return request<Entity>('/api/entities', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchEntity(entityId: string): Promise<Entity> {
  return request<Entity>(`/api/entities/${encodeURIComponent(entityId)}`)
}

export async function updateEntity(entityId: string, payload: { name: string; description?: string }): Promise<Entity> {
  return request<Entity>(`/api/entities/${encodeURIComponent(entityId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteEntity(entityId: string): Promise<void> {
  return request<void>(`/api/entities/${encodeURIComponent(entityId)}`, {
    method: 'DELETE',
  })
}
