import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { apiRequest, type AuthUser } from './api'

type AuthContextValue = { user: AuthUser | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; refresh: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const refresh = async () => {
    try { setUser(await apiRequest<AuthUser>('/auth/me')) } catch { setUser(null) } finally { setLoading(false) }
  }
  useEffect(() => { void refresh() }, [])
  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setUser(data.user)
  }
  const logout = async () => { await apiRequest('/auth/logout', { method: 'POST' }); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}

function SessionLoading() { return <div className="flex min-h-svh items-center justify-center bg-bg text-sm font-medium text-muted">Checking secure session…</div> }

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <SessionLoading />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <>{children}</>
}

export function GuestOnly() {
  const { user, loading } = useAuth()
  if (loading) return <SessionLoading />
  return user ? <Navigate to="/" replace /> : <Outlet />
}
