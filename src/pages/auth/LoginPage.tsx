import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AuthError, AuthLayout } from './AuthLayout'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { await login(email, password); navigate(from, { replace: true }) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in') } finally { setLoading(false) }
  }
  const google = () => { window.location.assign('http://127.0.0.1:8000/api/auth/google') }

  return <AuthLayout eyebrow="Account access" title="Welcome back" description="Sign in to continue to your compliance workspace.">
    <button type="button" onClick={google} className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm font-medium text-ink shadow-sm transition hover:bg-bg"><span className="font-semibold text-brand">G</span>Continue with Google</button>
    <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
    <form className="space-y-4" onSubmit={submit}>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Email address<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15" /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15" /></label>
      {error ? <AuthError>{error}</AuthError> : null}
      <button disabled={loading} className="h-10 w-full rounded-md bg-brand text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="mt-6 text-center text-sm text-muted">New to the workspace? <Link className="font-semibold text-brand hover:text-brand-dark" to="/signup">Create an account</Link></p>
  </AuthLayout>
}
