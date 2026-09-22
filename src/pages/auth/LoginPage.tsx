import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AuthError, AuthLayout } from './AuthLayout'
import { RoleSelector, type AuthRole } from './RoleSelector'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AuthRole | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { if (!role) throw new Error('Please select a valid account type.'); await login(email, password, role); navigate(from, { replace: true }) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in') } finally { setLoading(false) }
  }
  const google = () => {
    if (!role) return setError('Please select a valid account type.')
    setGoogleLoading(true)
    window.location.assign(`http://127.0.0.1:8000/api/auth/google?${new URLSearchParams({ role, mode: 'login' })}`)
  }

  return <AuthLayout eyebrow="Account access" title="Welcome back" description="Sign in to continue to your compliance workspace.">
    <p className="mb-2 text-sm font-semibold text-ink">Sign in as</p>
    <RoleSelector value={role} onChange={(selectedRole) => { setRole(selectedRole); setError('') }} />
    <form className="mt-6 space-y-4" onSubmit={submit}>
      <label className="flex flex-col gap-2 text-sm font-medium text-ink">Email address<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="h-13 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15" /></label>
      <label className="flex flex-col gap-2 text-sm font-medium text-ink">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-13 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15" /></label>
      {error ? <AuthError>{error}</AuthError> : null}
      <button disabled={loading || googleLoading} className="h-13 w-full rounded-xl bg-success px-4 text-base font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-success/25 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Login'}</button>
    </form>
    <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
    <button type="button" disabled={loading || googleLoading} onClick={google} className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 text-base font-medium text-ink shadow-sm transition hover:bg-bg focus:outline-none focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold text-brand shadow-sm">G</span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</button>
    <p className="mt-7 text-center text-sm text-muted">Don’t have an account? <Link className="font-semibold text-brand transition hover:text-brand-dark" to="/signup">Sign up</Link></p>
  </AuthLayout>
}
