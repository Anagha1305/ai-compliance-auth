import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../auth/api'
import { useAuth } from '../../auth/AuthContext'
import { AuthError, AuthLayout } from './AuthLayout'

type SignupState = { email?: string; verified?: boolean }
export function SignupPage() {
  const { refresh } = useAuth()
  const navigate = useNavigate(); const location = useLocation(); const prior = (location.state || {}) as SignupState
  const [email, setEmail] = useState(prior.email || ''); const [name, setName] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const verified = Boolean(prior.verified)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      if (verified) { await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }); await refresh(); navigate('/', { replace: true }) }
      else { await apiRequest('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }); navigate('/verify-email', { state: { email } }) }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to continue') } finally { setLoading(false) }
  }
  const google = () => { window.location.assign('http://127.0.0.1:8000/api/auth/google') }
  return <AuthLayout eyebrow="Create an account" title={verified ? 'Complete your profile' : 'Secure your workspace'} description={verified ? 'Your email has been verified. Add your details to finish registration.' : 'Create an account to begin compliance inspections.'}>
    {!verified ? <><button type="button" onClick={google} className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm font-medium text-ink shadow-sm transition hover:bg-bg"><span className="font-semibold text-brand">G</span>Continue with Google</button><div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div></> : null}
    <form className="space-y-4" onSubmit={submit}>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Email address<input required disabled={verified} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand disabled:bg-bg" /></label>
      {verified ? <><label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Full name<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand" /></label><label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Create password<input required type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand" /></label></> : null}
      {error ? <AuthError>{error}</AuthError> : null}<button disabled={loading} className="h-10 w-full rounded-md bg-brand text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60">{loading ? (verified ? 'Creating account…' : 'Sending code…') : (verified ? 'Create account' : 'Continue with email')}</button>
    </form>
    <p className="mt-6 text-center text-sm text-muted">Already registered? <Link className="font-semibold text-brand hover:text-brand-dark" to="/login">Sign in</Link></p>
  </AuthLayout>
}
