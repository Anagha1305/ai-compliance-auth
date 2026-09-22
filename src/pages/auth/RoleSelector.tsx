export const AUTH_ROLES = ['officer', 'manufacturer', 'consumer'] as const

export type AuthRole = (typeof AUTH_ROLES)[number]

const labels: Record<AuthRole, string> = {
  officer: 'Officer',
  manufacturer: 'Manufacturer',
  consumer: 'Consumer',
}

export function RoleSelector({ value, onChange }: { value: AuthRole | null; onChange: (role: AuthRole) => void }) {
  return <div className="grid grid-cols-3 overflow-hidden rounded-md border border-border bg-bg" role="group" aria-label="Account type">
    {AUTH_ROLES.map((role) => <button key={role} type="button" onClick={() => onChange(role)} aria-pressed={value === role} className={`min-h-10 border-r border-border px-2 text-xs font-semibold transition last:border-r-0 sm:text-sm ${value === role ? 'bg-brand text-white' : 'bg-surface text-muted hover:bg-bg hover:text-ink'}`}>{labels[role]}</button>)}
  </div>
}
