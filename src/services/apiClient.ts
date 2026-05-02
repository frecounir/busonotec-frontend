const BASE_URL = import.meta.env.BACKEND_BASE ?? ''

async function parseJson(response: Response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await parseJson(response).catch(() => null)
    const message =
      typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody
        ? (errorBody as { message?: string }).message
        : response.statusText || 'Request failed'
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return (await parseJson(response)) as T
}
