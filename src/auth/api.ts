const API_BASE_URL = '/api'

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Something went wrong')
  return data as T
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  auth_provider?: string
  email_verified?: boolean
}
