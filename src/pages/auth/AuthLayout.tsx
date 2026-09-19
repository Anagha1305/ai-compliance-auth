import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-navy px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.42),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(22,163,74,0.16),transparent_34%)]" aria-hidden="true" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/15 bg-white shadow-[0_30px_80px_rgb(11_31_58_/_0.42)] lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="hidden bg-navy p-10 text-white lg:block">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-sm shadow-sm">AI</span>AI Compliance Inspector</Link>
          <p className="mt-20 text-xs font-semibold uppercase tracking-wide text-blue-200">Secure inspection workspace</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Inspect smart.<br /><span className="text-blue-200">Verify compliance.</span></h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/75">A protected workspace for label analysis, evidence-backed findings, and compliance reporting.</p>
          <div className="mt-16 border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-wide text-blue-100/55">Authenticated access · Secure session</div>
        </aside>
        <main className="p-6 sm:p-10 lg:p-12">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-navy lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-sm text-white shadow-sm">AI</span>AI Compliance Inspector</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-brand lg:mt-0">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          <div className="mt-7">{children}</div>
        </main>
      </div>
    </div>
  )
}

export function AuthError({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5 text-sm text-danger">{children}</p>
}
