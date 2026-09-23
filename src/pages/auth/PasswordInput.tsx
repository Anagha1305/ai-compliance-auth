import { useState } from 'react'

export function PasswordInput({ value, onChange, placeholder, autoComplete }: { value: string; onChange: (value: string) => void; placeholder: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false)
  return <span className="relative">
    <input required type={visible ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-border bg-surface px-4 pr-16 text-base font-normal outline-none transition focus:border-success focus:ring-4 focus:ring-success/15" />
    <button type="button" onClick={() => setVisible((current) => !current)} className="absolute inset-y-0 right-1 rounded-lg px-3 text-xs font-semibold text-brand transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? 'Hide' : 'Show'}</button>
  </span>
}
