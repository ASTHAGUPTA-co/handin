const MS_DAY = 24 * 60 * 60 * 1000

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date, n) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + n)
  return copy
}

export function endOfDueDay(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d, 23, 59, 59, 999)
}

export function isPastDue(dateKey, now = new Date()) {
  return now.getTime() > endOfDueDay(dateKey).getTime()
}

export function daysFromToday(dateKey, now = new Date()) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((due.getTime() - today.getTime()) / MS_DAY)
}

export function formatDueDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function relativeDue(dateKey, now = new Date()) {
  const diff = daysFromToday(dateKey, now)
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff > 1) return `Due in ${diff} days`
  if (diff === -1) return '1 day overdue'
  return `${Math.abs(diff)} days overdue`
}
