import { useState } from 'react'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import StatusBadge from '../ui/StatusBadge'
import Avatar from '../ui/Avatar'
import ConfirmDialog from '../ui/ConfirmDialog'
import { findSubmission, getAssignedStudents, getCompletion, getStatus } from '../../utils/assignments'
import { formatDueDate, isPastDue, relativeDue } from '../../utils/dates'

export default function AssignmentPanel({ assignment, students, submissions, onEdit, onDelete, index = 0 }) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const assigned = getAssignedStudents(assignment, students)
  const { done, total, pct } = getCompletion(assignment, students, submissions)
  const late = isPastDue(assignment.dueDate)
  const tableId = `table-${assignment.id}`

  return (
    <article
      className="animate-rise rounded-2xl border border-line bg-card p-5 shadow-sm dark:border-[#3a342b] dark:bg-[#221e18]"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug">{assignment.title}</h3>
          <p className="mt-1 text-sm text-ink-soft dark:text-[#a89e90]">
            <span className={late ? 'font-medium text-brand-dark dark:text-orange-300' : ''}>
              {formatDueDate(assignment.dueDate)} · {relativeDue(assignment.dueDate)}
            </span>
            {' · '}
            {assignment.assignedTo === 'all' ? 'All students' : `${assigned.length} selected`}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="secondary" onClick={() => onEdit(assignment)} aria-label={`Edit ${assignment.title}`}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => setDeleting(true)} aria-label={`Delete ${assignment.title}`}>
            Delete
          </Button>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-[#c9c0b2]">{assignment.description}</p>
      <a
        href={assignment.driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-medium text-brand underline-offset-2 hover:underline dark:text-orange-400"
      >
        Submission folder<span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>

      <div className="mt-4">
        <ProgressBar value={pct} label={`${done} of ${total} submitted`} />
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={tableId}
        className="mt-3 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-sm font-medium text-ink-soft hover:text-ink dark:text-[#a89e90] dark:hover:text-white"
      >
        <span>{open ? 'Hide student status' : 'Show student status'}</span>
        <span aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div id={tableId} className="animate-rise mt-1">
          {assigned.length === 0 ? (
            <p className="py-3 text-sm text-ink-soft dark:text-[#a89e90]">No students are assigned to this yet.</p>
          ) : (
            <ul className="divide-y divide-line dark:divide-[#3a342b]">
              {assigned.map((s) => {
                const sub = findSubmission(submissions, assignment.id, s.id)
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar user={s} size={28} />
                      <span className="truncate text-sm">{s.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {sub && (
                        <span className="hidden text-xs text-ink-soft sm:inline dark:text-[#a89e90]">
                          {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      <StatusBadge status={getStatus(assignment, s.id, submissions)} />
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this assignment?"
          message={`"${assignment.title}" and all submission records for it will be removed for everyone. This can't be undone.`}
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setDeleting(false)}
          onConfirm={() => {
            onDelete(assignment.id)
            setDeleting(false)
          }}
        />
      )}
    </article>
  )
}
