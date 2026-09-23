import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../auth/api'
import { useAuth } from '../../auth/AuthContext'
import { AuthError, AuthLayout } from './AuthLayout'
import { PasswordInput } from './PasswordInput'
import { RoleSelector, type AuthRole } from './RoleSelector'

type SignupState = { email?: string; verified?: boolean; role?: AuthRole; governmentId?: string; companyId?: string }

export function SignupPage() {
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const prior = (location.state || {}) as SignupState
  const [email, setEmail] = useState(prior.email || '')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<AuthRole | null>(prior.role || null)
  const [governmentId, setGovernmentId] = useState(prior.governmentId || '')
  const [companyId, setCompanyId] = useState(prior.companyId || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const verified = Boolean(prior.verified)
  const identityError = () => !role ? 'Please select a valid account type.' : role === 'officer' && !governmentId.trim() ? 'Government ID is required for Officer registration.' : role === 'manufacturer' && !companyId.trim() ? 'Company ID is required for Manufacturer registration.' : ''

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const identityMessage = identityError()
      if (identityMessage) throw new Error(identityMessage)
      if (verified) {
        if (password !== confirmPassword) throw new Error('Passwords do not match.')
        await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role, government_id: role === 'officer' ? governmentId.trim() : undefined, company_id: role === 'manufacturer' ? companyId.trim() : undefined }) })
        await refresh(); navigate('/', { replace: true })
      } else {
        await apiRequest('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) })
        navigate('/verify-email', { state: { email, role, governmentId, companyId } })
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to continue') } finally { setLoading(false) }
  }
  const google = () => {
    const identityMessage = identityError()
    if (identityMessage || !role) return setError(identityMessage || 'Please select a valid account type.')
    const params = new URLSearchParams({ role, mode: 'signup' })
    if (role === 'officer') params.set('government_id', governmentId.trim())
    if (role === 'manufacturer') params.set('company_id', companyId.trim())
    window.location.assign(`http://127.0.0.1:8000/api/auth/google?${params}`)
  }

  return <AuthLayout eyebrow={verified ? 'Email verified' : undefined} title={verified ? 'Complete your profile' : undefined} description={verified ? 'Add your details to finish registration.' : undefined}>
    {!verified ? <div className="mb-6 space-y-4">
      <p className="text-sm font-medium text-ink">Choose your account type</p>
      <RoleSelector value={role} onChange={(selectedRole) => { setRole(selectedRole); setError('') }} />
      {role === 'officer' ? <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Government ID<input required value={governmentId} onChange={(e) => setGovernmentId(e.target.value)} placeholder="GOV-123456" className="h-12 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-success focus:ring-4 focus:ring-success/15" /></label> : null}
      {role === 'manufacturer' ? <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Company ID<input required value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="COMP-123456" className="h-12 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-success focus:ring-4 focus:ring-success/15" /></label> : null}
      <button type="button" onClick={google} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 text-base font-medium text-ink shadow-sm transition hover:bg-bg focus:outline-none focus:ring-4 focus:ring-brand/15"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold text-brand shadow-sm">G</span>Continue with Google</button>
      <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
    </div> : <p className="mb-4 rounded-md border border-border bg-bg px-3 py-2 text-sm text-muted">Registering as <span className="font-semibold capitalize text-ink">{role}</span>.</p>}
    <form className="space-y-4" onSubmit={submit}>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Email address<input required disabled={verified} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="h-12 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-success focus:ring-4 focus:ring-success/15 disabled:bg-bg" /></label>
      {verified ? <>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">{role === 'manufacturer' ? 'Company / organization name' : 'Full name'}<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'manufacturer' ? 'Organization name' : 'Your full name'} className="h-12 rounded-xl border border-border bg-surface px-4 text-base font-normal outline-none transition focus:border-success focus:ring-4 focus:ring-success/15" /></label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Create password<PasswordInput value={password} onChange={setPassword} autoComplete="new-password" placeholder="Create a password" /></label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Confirm password<PasswordInput value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Re-enter your password" /></label>
      </> : null}
      {error ? <AuthError>{error}</AuthError> : null}
      <button disabled={loading} className="h-12 w-full rounded-xl bg-success text-base font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-success/25 disabled:cursor-not-allowed disabled:opacity-60">{loading ? (verified ? 'Creating account…' : 'Sending code…') : (verified ? 'Create account' : 'Send verification code')}</button>
    </form>
    <p className="mt-6 text-center text-sm text-muted">Already registered? <Link className="font-semibold text-brand hover:text-brand-dark" to="/login">Sign in</Link></p>
  </AuthLayout>
}
