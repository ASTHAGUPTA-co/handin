import { useState } from 'react'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import { formatDueDate, relativeDue } from '../../utils/dates'

export default function AssignmentCard({ assignment, status, submittedAt, professorName, onSubmit, index = 0 }) {
  const [confirming, setConfirming] = useState(false)
  const overdue = status === 'overdue'
  const done = status === 'submitted'

  const accent = done
    ? 'border-l-moss'
    : overdue
      ? 'border-l-brand'
      : 'border-l-transparent'

  return (
    <article
      className={`animate-rise rounded-2xl border border-l-4 border-line bg-card p-5 shadow-sm dark:border-[#3a342b] dark:bg-[#221e18] ${accent} ${done ? 'opacity-90' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      aria-labelledby={`title-${assignment.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 id={`title-${assignment.id}`} className="font-display text-lg font-semibold leading-snug">
            {assignment.title}
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft dark:text-[#a89e90]">Set by {professorName}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-[#c9c0b2]">{assignment.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className={overdue ? 'font-medium text-brand-dark dark:text-orange-300' : ''}>
          <span aria-hidden="true">🗓 </span>
          {formatDueDate(assignment.dueDate)}
          {!done && <span className="ml-1.5 text-xs">({relativeDue(assignment.dueDate)})</span>}
        </span>
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand underline-offset-2 hover:underline dark:text-orange-400"
        >
          Open Drive folder
          <span className="sr-only"> for {assignment.title} (opens in a new tab)</span>
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>

      <div className="mt-4 border-t border-line pt-4 dark:border-[#3a342b]">
        {done ? (
          <p className="text-sm text-moss dark:text-emerald-300">
            <span aria-hidden="true">✓ </span>
            Submitted on {new Date(submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}. Nice work.
          </p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft dark:text-[#a89e90]">
              Uploaded your work to the Drive folder?
            </p>
            <Button onClick={() => setConfirming(true)}>
              {overdue ? 'Yes, I have submitted (late)' : 'Yes, I have submitted'}
            </Button>
          </div>
        )}
      </div>

      {confirming && (
        <ConfirmDialog
          title="Final check"
          message={`You're marking "${assignment.title}" as submitted. Your professor will see this straight away and it can't be undone. Is your work really in the Drive folder?`}
          confirmLabel="Confirm submission"
          cancelLabel="Not yet"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            onSubmit(assignment.id)
            setConfirming(false)
          }}
        />
      )}
    </article>
  )
}
