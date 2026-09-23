import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthLayout({ eyebrow, title, description, children }: { eyebrow?: string; title?: string; description?: string; children: ReactNode }) {
  return <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#effaf7] px-4 py-8 sm:px-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(34,197,94,0.15),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.16),transparent_42%)]" aria-hidden="true" />
    <main className="relative w-full max-w-lg rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_rgb(15_23_42_/_0.14)] backdrop-blur sm:p-10">
      <Link to="/" className="mx-auto block w-fit rounded-2xl border border-blue-100 bg-[#f8fbff] px-3 py-2 shadow-sm transition hover:-translate-y-px hover:shadow-md"><img src="/branding/compli-logo.jpg" alt="Compli" className="h-auto w-48 mix-blend-multiply sm:w-56" /></Link>
      {title || description || eyebrow ? <div className="mt-8 text-center">{eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p> : null}{title ? <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1> : null}{description ? <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">{description}</p> : null}</div> : null}
      <div className={title || description || eyebrow ? 'mt-8' : 'mt-7'}>{children}</div>
      <p className="mt-8 border-t border-emerald-100 pt-5 text-center text-xs font-medium tracking-wide text-emerald-700">Compli — Scan Once, Stay Compliant Forever</p>
    </main>
  </div>
}

export function AuthError({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-3 py-2.5 text-sm text-danger">{children}</p>
}
