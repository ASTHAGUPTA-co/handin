import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AssignmentCard from '../components/student/AssignmentCard'
import FilterBar from '../components/ui/FilterBar'
import ProgressRing from '../components/ui/ProgressRing'
import { EmptyState } from '../components/ui/States'
import Button from '../components/ui/Button'
import { findSubmission, getStatus, isAssignedTo, sortByDue } from '../utils/assignments'
import { relativeDue } from '../utils/dates'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Not submitted' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'submitted', label: 'Submitted' },
]

function nudge(rows) {
  if (rows.length === 0) return 'Nothing assigned to you yet.'
  const overdue = rows.filter((r) => r.status === 'overdue')
  const upcoming = rows.filter((r) => r.status === 'pending').sort((a, b) => a.assignment.dueDate.localeCompare(b.assignment.dueDate))
  if (overdue.length > 0) {
    return `${overdue.length} overdue. Worth tackling first.`
  }
  if (upcoming.length > 0) {
    const next = upcoming[0].assignment
    return `Up next: ${next.title} (${relativeDue(next.dueDate).toLowerCase()})`
  }
  return "You're all caught up. 🎉"
}

export default function StudentDashboard() {
  const { user, users } = useAuth()
  const { assignments, submissions, markSubmitted } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('asc')

  const rows = useMemo(() => {
    return assignments
      .filter((a) => isAssignedTo(a, user.id))
      .map((assignment) => ({
        assignment,
        status: getStatus(assignment, user.id, submissions),
        submission: findSubmission(submissions, assignment.id, user.id),
      }))
  }, [assignments, submissions, user.id])

  const submittedCount = rows.filter((r) => r.status === 'submitted').length

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (!q) return true
      return (
        r.assignment.title.toLowerCase().includes(q) ||
        r.assignment.description.toLowerCase().includes(q)
      )
    })
    const sortedAssignments = sortByDue(filtered.map((r) => r.assignment), sort)
    return sortedAssignments.map((a) => filtered.find((r) => r.assignment.id === a.id))
  }, [rows, search, statusFilter, sort])

  const filtersActive = search !== '' || statusFilter !== 'all'
  const nameOf = (id) => users.find((u) => u.id === id)?.name ?? 'Unknown'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <section
        aria-label="Your progress"
        className="animate-rise flex items-center gap-5 rounded-2xl border border-line bg-card p-5 dark:border-[#3a342b] dark:bg-[#221e18]"
      >
        <ProgressRing done={submittedCount} total={rows.length} />
        <div>
          <h1 className="font-display text-2xl font-bold">
            Hi {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm font-medium">
            {submittedCount} of {rows.length} submitted
          </p>
          <p className="mt-0.5 text-sm text-ink-soft dark:text-[#a89e90]">{nudge(rows)}</p>
        </div>
      </section>

      <div className="mt-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          status={statusFilter}
          onStatus={setStatusFilter}
          statusOptions={STATUS_OPTIONS}
          sort={sort}
          onSort={setSort}
          resultCount={visible.length}
        />
      </div>

      <div className="mt-4 space-y-4">
        {rows.length === 0 ? (
          <EmptyState
            emoji="🌤"
            title="Nothing due"
            message="Your professors haven't assigned anything to you yet. Enjoy it while it lasts."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            emoji="🔎"
            title="No matches"
            message="No assignments fit those filters."
            action={
              filtersActive && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          visible.map(({ assignment, status, submission }, i) => (
            <AssignmentCard
              key={assignment.id}
              index={i}
              assignment={assignment}
              status={status}
              submittedAt={submission?.submittedAt}
              professorName={nameOf(assignment.adminId)}
              onSubmit={(id) => markSubmitted(id, user.id)}
            />
          ))
        )}
      </div>
    </main>
  )
}
