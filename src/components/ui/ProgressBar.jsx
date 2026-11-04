// Colour shifts with how the class is doing, so a glance is enough.
function tone(pct) {
  if (pct >= 80) return 'bg-moss'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-brand'
}

export default function ProgressBar({ value, label, showLabel = true }) {
  return (
    <div>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-ink-soft dark:text-[#a89e90]">
          <span>{label}</span>
          <span className="font-medium tabular-nums">{value}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-line dark:bg-[#3a342b]"
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${tone(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
