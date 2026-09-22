import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../auth/api'
import { AuthError, AuthLayout } from './AuthLayout'

export function VerifyEmailPage() {
  const navigate = useNavigate(); const location = useLocation(); const signup = (location.state as { email?: string; role?: string; governmentId?: string; companyId?: string } | null) || {}; const email = signup.email || ''
  const [otp, setOtp] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); if (otp.length !== 6) return setError('Please enter the 6-digit verification code.'); setLoading(true); try { await apiRequest('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }); navigate('/signup', { state: { ...signup, email, verified: true } }) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to verify code') } finally { setLoading(false) } }
  return <AuthLayout eyebrow="Email verification" title="Check your inbox" description={email ? `We sent a six-digit verification code to ${email}.` : 'Return to sign up to request a verification code.'}>
    <form className="space-y-4" onSubmit={submit}><label className="flex flex-col gap-1.5 text-sm font-medium text-ink">Verification code<input required autoFocus type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="h-12 rounded-md border border-border bg-surface px-3 text-center font-mono text-xl tracking-[0.35em] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15" /></label>{error ? <AuthError>{error}</AuthError> : null}<button disabled={loading || !email} className="h-10 w-full rounded-md bg-brand text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60">{loading ? 'Verifying…' : 'Verify email'}</button></form>
    <p className="mt-6 text-center text-sm text-muted"><Link className="font-semibold text-brand hover:text-brand-dark" to="/signup">Back to sign up</Link></p>
  </AuthLayout>
}
