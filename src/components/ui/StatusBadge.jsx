const STYLES = {
  submitted: {
    label: 'Submitted',
    icon: '✓',
    cls: 'bg-moss-soft text-moss dark:bg-moss/20 dark:text-emerald-300',
  },
  pending: {
    label: 'Not submitted',
    icon: '○',
    cls: 'bg-amber-soft text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  },
  overdue: {
    label: 'Overdue',
    icon: '!',
    cls: 'bg-rust-soft text-brand-dark dark:bg-brand/20 dark:text-orange-300',
  },
}

export default function StatusBadge({ status, className = '' }) {
  const s = STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls} ${className}`}
    >
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </span>
  )
}
