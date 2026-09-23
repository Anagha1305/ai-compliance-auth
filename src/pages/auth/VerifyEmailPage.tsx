import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../auth/api'
import { AuthError, AuthLayout } from './AuthLayout'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const signup = (location.state as { email?: string; role?: string; governmentId?: string; companyId?: string } | null) || {}
  const email = signup.email || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!seconds) return
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setMessage('')
    if (otp.length !== 6) return setError('Please enter the 6-digit verification code.')
    setLoading(true)
    try {
      await apiRequest('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) })
      setMessage('Email verified. Continuing to account setup…')
      window.setTimeout(() => navigate('/signup', { state: { ...signup, email, verified: true } }), 350)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to verify code') } finally { setLoading(false) }
  }
  const resend = async () => {
    setError(''); setMessage(''); setResending(true)
    try {
      await apiRequest('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) })
      setSeconds(30); setMessage('A new verification code has been sent.')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to resend code') } finally { setResending(false) }
  }

  return <AuthLayout eyebrow="Email verification" title="Check your inbox" description={email ? `Enter the six-digit code sent to ${email}.` : 'Return to sign up to request a verification code.'}>
    <form className="space-y-5" onSubmit={submit}>
      <label className="flex flex-col gap-2 text-sm font-semibold text-ink">Verification code<input required autoFocus type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="h-14 rounded-xl border border-border bg-surface px-4 text-center font-mono text-2xl font-semibold tracking-[0.5em] outline-none transition focus:border-success focus:ring-4 focus:ring-success/15" /></label>
      {error ? <AuthError>{error}</AuthError> : null}
      {message ? <p role="status" className="rounded-xl border border-success/20 bg-success/10 px-3 py-2.5 text-sm text-success">{message}</p> : null}
      <button disabled={loading || !email} className="h-12 w-full rounded-xl bg-success text-base font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-success/25 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Verifying…' : 'Verify email'}</button>
    </form>
    <div className="mt-6 text-center text-sm text-muted">Didn’t receive the code? <button type="button" disabled={!email || resending || seconds > 0} onClick={resend} className="font-semibold text-brand transition hover:text-brand-dark disabled:cursor-not-allowed disabled:text-muted">{resending ? 'Sending…' : seconds > 0 ? `Resend in ${seconds}s` : 'Resend code'}</button></div>
    <p className="mt-4 text-center text-sm text-muted"><Link className="font-semibold text-brand hover:text-brand-dark" to="/signup">Back to sign up</Link></p>
  </AuthLayout>
}
