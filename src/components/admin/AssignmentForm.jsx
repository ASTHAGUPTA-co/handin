import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { toDateKey } from '../../utils/dates'

const inputCls =
  'w-full rounded-lg border bg-card px-3 py-2 text-sm dark:bg-[#17140f] dark:text-[#f1ece3]'

function isValidUrl(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function validate(f) {
  const errors = {}
  if (!f.title.trim()) errors.title = 'Give the assignment a title.'
  if (!f.description.trim()) errors.description = 'Add a short description so students know what to do.'
  if (!f.dueDate) errors.dueDate = 'Pick a due date.'
  if (!f.driveLink.trim()) errors.driveLink = 'Add the Drive link where students will submit.'
  else if (!isValidUrl(f.driveLink.trim())) errors.driveLink = 'That doesn\'t look like a full link (start with https://).'
  if (f.audience === 'selected' && f.selectedIds.length === 0) {
    errors.audience = 'Choose at least one student, or switch to "All students".'
  }
  return errors
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default function AssignmentForm({ initial, students, onSave, onCancel }) {
  const editing = Boolean(initial)
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dueDate: initial?.dueDate ?? '',
    driveLink: initial?.driveLink ?? '',
    audience: initial ? (initial.assignedTo === 'all' ? 'all' : 'selected') : 'all',
    selectedIds: initial && initial.assignedTo !== 'all' ? initial.assignedTo : [],
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const set = (key, value) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched) setErrors(validate(next)) // re-check as they fix things
  }

  const toggleStudent = (id) => {
    const has = form.selectedIds.includes(id)
    set('selectedIds', has ? form.selectedIds.filter((s) => s !== id) : [...form.selectedIds, id])
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      driveLink: form.driveLink.trim(),
      assignedTo: form.audience === 'all' ? 'all' : form.selectedIds,
    })
  }

  const border = (key) => (errors[key] ? 'border-red-500' : 'border-line dark:border-[#3a342b]')
  const describedBy = (key) => (errors[key] ? `${key}-error` : undefined)

  return (
    <Modal
      title={editing ? 'Edit assignment' : 'New assignment'}
      description="Students will see this the moment you save."
      onClose={onCancel}
      size="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="title" label="Title" error={errors.title}>
          <input
            id="title"
            data-autofocus
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={describedBy('title')}
            className={`${inputCls} ${border('title')}`}
            maxLength={80}
          />
        </Field>

        <Field id="description" label="Description" error={errors.description}>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy('description')}
            className={`${inputCls} ${border('description')}`}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="dueDate" label="Due date" error={errors.dueDate}>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              min={editing ? undefined : toDateKey(new Date())}
              onChange={(e) => set('dueDate', e.target.value)}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={describedBy('dueDate')}
              className={`${inputCls} ${border('dueDate')}`}
            />
          </Field>
          <Field id="driveLink" label="Drive link for submission" error={errors.driveLink}>
            <input
              id="driveLink"
              type="url"
              inputMode="url"
              placeholder="https://drive.google.com/..."
              value={form.driveLink}
              onChange={(e) => set('driveLink', e.target.value)}
              aria-invalid={Boolean(errors.driveLink)}
              aria-describedby={describedBy('driveLink')}
              className={`${inputCls} ${border('driveLink')}`}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Who is this for?</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="audience"
                checked={form.audience === 'all'}
                onChange={() => set('audience', 'all')}
                className="accent-brand"
              />
              All students
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="audience"
                checked={form.audience === 'selected'}
                onChange={() => set('audience', 'selected')}
                className="accent-brand"
              />
              Selected students
            </label>
          </div>

          {form.audience === 'selected' && (
            <div className="mt-3 grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2 dark:border-[#3a342b]">
              {students.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.selectedIds.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                    className="h-4 w-4 accent-brand"
                  />
                  {s.name}
                </label>
              ))}
            </div>
          )}
          {errors.audience && (
            <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.audience}</p>
          )}
        </fieldset>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{editing ? 'Save changes' : 'Create assignment'}</Button>
        </div>
      </form>
    </Modal>
  )
}
