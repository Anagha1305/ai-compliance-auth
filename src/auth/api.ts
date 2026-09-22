const API_BASE_URL = '/api'

function errorMessage(detail: unknown): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') return item.msg
        return null
      })
      .filter((message): message is string => message !== null)
      .join('. ')
  }
  return 'Something went wrong'
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(errorMessage(data.detail))
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
