export const AUTH_ROLES = ['officer', 'manufacturer', 'consumer'] as const

export type AuthRole = (typeof AUTH_ROLES)[number]

const labels: Record<AuthRole, string> = {
  officer: 'Officer',
  manufacturer: 'Manufacturer',
  consumer: 'Consumer',
}

export function RoleSelector({ value, onChange }: { value: AuthRole | null; onChange: (role: AuthRole) => void }) {
  return <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/70 p-1" role="group" aria-label="Account type">
    {AUTH_ROLES.map((role) => <button key={role} type="button" onClick={() => onChange(role)} aria-pressed={value === role} className={`min-h-11 rounded-lg px-2 text-xs font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-success/40 sm:text-sm ${value === role ? 'bg-success text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-navy'}`}>{labels[role]}</button>)}
  </div>
}
