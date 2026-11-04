import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('handin:theme', dark ? 'dark' : 'light')
    } catch {
      
    }
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-ink-soft transition-colors hover:bg-black/5 dark:text-[#a89e90] dark:hover:bg-white/10"
    >
      <span aria-hidden="true">{dark ? '☀️' : '🌙'}</span>
    </button>
  )
}
