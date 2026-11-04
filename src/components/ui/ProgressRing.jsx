export default function ProgressRing({ done, total, size = 84 }) {
  const stroke = 8
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const pct = total === 0 ? 0 : done / total
  const allDone = total > 0 && done === total

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${done} of ${total} assignments submitted`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-line dark:stroke-[#3a342b]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className={`transition-all duration-700 ease-out ${allDone ? 'stroke-moss' : 'stroke-brand'}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display text-xl font-bold tabular-nums">{done}/{total}</span>
      </div>
    </div>
  )
}
