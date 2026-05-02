import { request } from './apiClient'
import type { Field } from '../types'

export async function createField(entityId: string, payload: Omit<Field, 'id'>): Promise<Field> {
  return request<Field>(`/api/entities/${encodeURIComponent(entityId)}/fields`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateField(entityId: string, fieldId: string, payload: Omit<Field, 'id'>): Promise<Field> {
  return request<Field>(`/api/entities/${encodeURIComponent(entityId)}/fields/${encodeURIComponent(fieldId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteField(entityId: string, fieldId: string): Promise<void> {
  return request<void>(`/api/entities/${encodeURIComponent(entityId)}/fields/${encodeURIComponent(fieldId)}`, {
    method: 'DELETE',
  })
}
