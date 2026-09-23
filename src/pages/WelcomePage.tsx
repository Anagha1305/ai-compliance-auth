import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const roleLabel = (role?: string) => role ? `${role.slice(0, 1).toUpperCase()}${role.slice(1)}` : 'user'

export function WelcomePage() {
  const { user } = useAuth()
  const role = roleLabel(user?.role)
  const firstName = user?.name?.split(' ')[0]

  return <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#effaf7] px-4 py-8">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.16),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.16),transparent_42%)]" aria-hidden="true" />
    <section className="relative w-full max-w-lg rounded-3xl border border-white/80 bg-white/85 p-8 text-center shadow-[0_28px_80px_rgb(15_23_42_/_0.14)] backdrop-blur sm:p-10">
      <img src="/branding/compli-logo.jpg" alt="Compli" className="mx-auto h-auto w-48 mix-blend-multiply sm:w-56" />
      <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-success text-3xl font-bold text-white shadow-[0_10px_24px_rgb(22_163_74_/_0.25)]" aria-label="Authentication successful">✓</div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-success">Secure access confirmed</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Sign in successful</h1>
      <p className="mt-4 text-base leading-7 text-muted">Welcome back{firstName ? `, ${firstName}` : ''}. You are securely authenticated as an <span className="font-semibold text-navy">{role}</span>.</p>
      <Link to="/dashboard" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-success px-4 text-base font-semibold text-white shadow-sm transition hover:-translate-y-px hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-success/25">Continue to workspace</Link>
      <p className="mt-8 border-t border-emerald-100 pt-5 text-xs font-medium tracking-wide text-emerald-700">Compli — Scan Once, Stay Compliant Forever</p>
    </section>
  </main>
}
