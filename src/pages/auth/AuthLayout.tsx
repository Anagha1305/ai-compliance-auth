import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-navy px-4 py-8 sm:px-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(74,222,128,0.18),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(37,99,235,0.28),transparent_38%)]" aria-hidden="true" />
    <main className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_28px_80px_rgb(2_16_31_/_0.45)] backdrop-blur sm:p-10">
      <Link to="/" className="mx-auto flex w-fit items-center gap-3 text-sm font-semibold text-navy"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm text-white shadow-sm">AI</span>AI Compliance Inspector</Link>
      <div className="mt-9 text-center"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">{description}</p></div>
      <div className="mt-8">{children}</div>
      <p className="mt-8 border-t border-border pt-5 text-center text-xs text-muted">Protected by secure, HttpOnly sessions</p>
    </main>
  </div>
}

export function AuthError({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-3 py-2.5 text-sm text-danger">{children}</p>
}
