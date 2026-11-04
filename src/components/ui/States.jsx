import Button from './Button'

export function LoadingScreen({ label = 'Loading your assignments...' }) {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <span className="sr-only">{label}</span>
      {/* skeleton cards */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-line bg-card p-5 dark:border-[#3a342b] dark:bg-[#221e18]"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="h-4 w-1/3 rounded bg-line dark:bg-[#3a342b]" />
          <div className="mt-3 h-3 w-full rounded bg-line dark:bg-[#3a342b]" />
          <div className="mt-2 h-3 w-2/3 rounded bg-line dark:bg-[#3a342b]" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ emoji = '📭', title, message, action }) {
  return (
    <div className="animate-rise rounded-2xl border border-dashed border-line px-6 py-14 text-center dark:border-[#3a342b]">
      <div className="text-4xl" aria-hidden="true">{emoji}</div>
      <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft dark:text-[#a89e90]">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry, onReset }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="text-4xl" aria-hidden="true">🧯</div>
      <h2 className="mt-3 font-display text-xl font-semibold">Something went sideways</h2>
      <p className="mt-2 text-sm text-ink-soft dark:text-[#a89e90]">
        We couldn&apos;t read the saved data. {message && <span className="block mt-1 font-mono text-xs">{message}</span>}
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="secondary" onClick={onRetry}>Try again</Button>
        <Button onClick={onReset}>Reset demo data</Button>
      </div>
    </div>
  )
}
