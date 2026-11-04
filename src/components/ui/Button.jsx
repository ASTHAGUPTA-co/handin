const VARIANTS = {
  primary:
    'bg-brand text-white hover:bg-brand-dark disabled:opacity-50',
  secondary:
    'border border-line bg-card text-ink hover:bg-paper dark:border-[#3a342b] dark:bg-[#221e18] dark:text-[#f1ece3] dark:hover:bg-[#2b261e]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  ghost:
    'text-ink-soft hover:bg-black/5 dark:text-[#a89e90] dark:hover:bg-white/10',
}

export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
