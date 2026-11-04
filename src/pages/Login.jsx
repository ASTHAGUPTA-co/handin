import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/ui/ThemeToggle'

function UserButton({ user, onPick }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onPick(user.id)}
        className="group flex w-full items-center gap-3 rounded-xl border border-line bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-[#3a342b] dark:bg-[#221e18]"
      >
        <Avatar user={user} size={40} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{user.name}</span>
          <span className="block truncate text-xs text-ink-soft dark:text-[#a89e90]">{user.title}</span>
        </span>
        <span aria-hidden="true" className="text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand">→</span>
      </button>
    </li>
  )
}

export default function Login() {
  const { users, login } = useAuth()
  const admins = users.filter((u) => u.role === 'admin')
  const students = users.filter((u) => u.role === 'student')

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <div className="animate-rise mt-6 text-center sm:mt-12">
        <div className="text-5xl" aria-hidden="true">📌</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Handin</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft dark:text-[#a89e90]">
          Who&apos;s sitting down today? Pick a person to explore the app. There are no passwords
          here, this is a demo with pretend people.
        </p>
      </div>

      <div className="animate-rise mt-10 grid gap-8 sm:grid-cols-2" style={{ animationDelay: '80ms' }}>
        <section aria-labelledby="admins-heading">
          <h2 id="admins-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft dark:text-[#a89e90]">
            Professors
          </h2>
          <ul className="space-y-2">
            {admins.map((u) => <UserButton key={u.id} user={u} onPick={login} />)}
          </ul>
        </section>
        <section aria-labelledby="students-heading">
          <h2 id="students-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft dark:text-[#a89e90]">
            Students
          </h2>
          <ul className="space-y-2">
            {students.map((u) => <UserButton key={u.id} user={u} onPick={login} />)}
          </ul>
        </section>
      </div>
    </main>
  )
}
