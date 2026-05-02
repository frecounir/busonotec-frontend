import { request } from './apiClient'
import type { AIModelResponse } from '../types'

export async function generateModel(prompt: string): Promise<AIModelResponse> {
  return request<AIModelResponse>('/api/prompts', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}

export async function createSchema(prompt: string): Promise<AIModelResponse> {
  return request<AIModelResponse>('/api/schema', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}
