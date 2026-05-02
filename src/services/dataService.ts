import { request } from './apiClient'
import type { DataQueryResponse, DataRow } from '../types'

export async function fetchData(entityId: string): Promise<DataQueryResponse> {
  return request<DataQueryResponse>(`/api/data/${encodeURIComponent(entityId)}`)
}

export async function createRow(entityId: string, row: DataRow): Promise<DataRow> {
  return request<DataRow>(`/api/data/${encodeURIComponent(entityId)}`, {
    method: 'POST',
    body: JSON.stringify(row),
  })
}
