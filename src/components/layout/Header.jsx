import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Avatar from '../ui/Avatar'
import ThemeToggle from '../ui/ThemeToggle'
import Button from '../ui/Button'

export default function Header() {
  const { user, logout } = useAuth()
  const { resetData } = useData()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur dark:border-[#3a342b] dark:bg-[#17140f]/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">📌</span>
          <span className="font-display text-xl font-bold tracking-tight">Handin</span>
          <span className="ml-1 hidden rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium capitalize text-ink-soft sm:inline dark:bg-white/10 dark:text-[#a89e90]">
            {user.role === 'admin' ? 'Professor' : 'Student'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden items-center gap-2 sm:flex">
            <Avatar user={user} size={32} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to the starting state?')) resetData()
            }}
            className="hidden rounded-lg px-2 py-1.5 text-xs text-ink-soft hover:bg-black/5 md:block dark:text-[#a89e90] dark:hover:bg-white/10"
          >
            Reset demo
          </button>
          <ThemeToggle />
          <Button variant="secondary" onClick={logout}>
            Switch user
          </Button>
        </div>
      </div>
    </header>
  )
}
