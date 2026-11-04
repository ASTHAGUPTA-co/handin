import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AssignmentForm from '../components/admin/AssignmentForm'
import AssignmentPanel from '../components/admin/AssignmentPanel'
import FilterBar from '../components/ui/FilterBar'
import Button from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { getCompletion, sortByDue } from '../utils/assignments'
import { isPastDue } from '../utils/dates'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All assignments' },
  { value: 'open', label: 'Still collecting' },
  { value: 'complete', label: 'Everyone submitted' },
  { value: 'pastdue', label: 'Past due date' },
]

export default function AdminDashboard() {
  const { user, students } = useAuth()
  const { assignments, submissions, createAssignment, updateAssignment, deleteAssignment } = useData()
  const [formState, setFormState] = useState(null) // null = closed, {} = new, {assignment} = editing
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('asc')

  const mine = useMemo(() => assignments.filter((a) => a.adminId === user.id), [assignments, user.id])

  const classRate = useMemo(() => {
    let done = 0
    let total = 0
    for (const a of mine) {
      const c = getCompletion(a, students, submissions)
      done += c.done
      total += c.total
    }
    return total === 0 ? 0 : Math.round((done / total) * 100)
  }, [mine, students, submissions])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = mine.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false
      if (filter === 'all') return true
      const { pct } = getCompletion(a, students, submissions)
      if (filter === 'complete') return pct === 100
      if (filter === 'open') return pct < 100
      if (filter === 'pastdue') return isPastDue(a.dueDate)
      return true
    })
    return sortByDue(filtered, sort)
  }, [mine, search, filter, sort, students, submissions])

  function handleSave(fields) {
    if (formState?.assignment) updateAssignment(formState.assignment.id, fields)
    else createAssignment(user.id, fields)
    setFormState(null)
  }

  const filtersActive = search !== '' || filter !== 'all'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <section className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Your assignments</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-[#a89e90]">
            {user.title} · {mine.length} {mine.length === 1 ? 'assignment' : 'assignments'}
            {mine.length > 0 && <> · {classRate}% submitted overall</>}
          </p>
        </div>
        <Button onClick={() => setFormState({})}>
          <span aria-hidden="true">＋</span> New assignment
        </Button>
      </section>

      {mine.length > 0 && (
        <div className="mt-6">
          <FilterBar
            search={search}
            onSearch={setSearch}
            status={filter}
            onStatus={setFilter}
            statusOptions={FILTER_OPTIONS}
            sort={sort}
            onSort={setSort}
            resultCount={visible.length}
          />
        </div>
      )}

      <div className="mt-4 space-y-4">
        {mine.length === 0 ? (
          <EmptyState
            emoji="🗂"
            title="No assignments yet"
            message="Create your first assignment and pick who it's for. You'll be able to track every student's progress here."
            action={<Button onClick={() => setFormState({})}>Create assignment</Button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            emoji="🔎"
            title="No matches"
            message="None of your assignments fit those filters."
            action={
              filtersActive && (
                <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all') }}>
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          visible.map((a, i) => (
            <AssignmentPanel
              key={a.id}
              index={i}
              assignment={a}
              students={students}
              submissions={submissions}
              onEdit={(assignment) => setFormState({ assignment })}
              onDelete={deleteAssignment}
            />
          ))
        )}
      </div>

      {formState && (
        <AssignmentForm
          initial={formState.assignment}
          students={students}
          onSave={handleSave}
          onCancel={() => setFormState(null)}
        />
      )}
    </main>
  )
}
