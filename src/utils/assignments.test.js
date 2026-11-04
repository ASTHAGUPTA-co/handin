import { describe, expect, it } from 'vitest'
import { getAssignedStudents, getCompletion, getStatus, isAssignedTo, sortByDue } from './assignments'
import { daysFromToday, isPastDue, relativeDue } from './dates'

const students = [{ id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }]
const NOW = new Date(2026, 10, 4, 15, 0, 0) // 4 Nov 2026, 3pm local

const base = { id: 'a1', title: 'T', description: 'D', driveLink: 'https://x.y', adminId: 'p1' }

describe('assignment audience', () => {
  it('"all" covers every student', () => {
    const a = { ...base, assignedTo: 'all', dueDate: '2026-11-10' }
    expect(getAssignedStudents(a, students)).toHaveLength(4)
    expect(isAssignedTo(a, 's3')).toBe(true)
  })

  it('selected students only', () => {
    const a = { ...base, assignedTo: ['s1', 's3'], dueDate: '2026-11-10' }
    expect(getAssignedStudents(a, students).map((s) => s.id)).toEqual(['s1', 's3'])
    expect(isAssignedTo(a, 's2')).toBe(false)
  })
})

describe('status + completion', () => {
  const a = { ...base, assignedTo: ['s1', 's2', 's3'], dueDate: '2026-11-10' }
  const submissions = [{ assignmentId: 'a1', studentId: 's1', submittedAt: '2026-11-03' }]

  it('submitted beats everything', () => {
    expect(getStatus(a, 's1', submissions, NOW)).toBe('submitted')
  })

  it('pending before the due date, overdue after', () => {
    expect(getStatus(a, 's2', submissions, NOW)).toBe('pending')
    const late = { ...a, dueDate: '2026-11-01' }
    expect(getStatus(late, 's2', submissions, NOW)).toBe('overdue')
  })

  it('computes completion against assigned students only', () => {
    expect(getCompletion(a, students, submissions)).toEqual({ done: 1, total: 3, pct: 33 })
  })

  it('handles an empty audience without dividing by zero', () => {
    const empty = { ...a, assignedTo: [] }
    expect(getCompletion(empty, students, submissions)).toEqual({ done: 0, total: 0, pct: 0 })
  })
})

describe('dates', () => {
  it('a task is still on time all day on its due date', () => {
    expect(isPastDue('2026-11-04', NOW)).toBe(false)
    expect(isPastDue('2026-11-03', NOW)).toBe(true)
  })

  it('counts whole days', () => {
    expect(daysFromToday('2026-11-07', NOW)).toBe(3)
    expect(daysFromToday('2026-11-02', NOW)).toBe(-2)
  })

  it('writes friendly relative text', () => {
    expect(relativeDue('2026-11-04', NOW)).toBe('Due today')
    expect(relativeDue('2026-11-05', NOW)).toBe('Due tomorrow')
    expect(relativeDue('2026-11-09', NOW)).toBe('Due in 5 days')
    expect(relativeDue('2026-11-03', NOW)).toBe('1 day overdue')
    expect(relativeDue('2026-11-01', NOW)).toBe('3 days overdue')
  })
})

describe('sorting', () => {
  it('sorts by due date without mutating the input', () => {
    const list = [
      { ...base, id: 'x', dueDate: '2026-12-01' },
      { ...base, id: 'y', dueDate: '2026-11-01' },
    ]
    expect(sortByDue(list, 'asc').map((a) => a.id)).toEqual(['y', 'x'])
    expect(sortByDue(list, 'desc').map((a) => a.id)).toEqual(['x', 'y'])
    expect(list[0].id).toBe('x')
  })
})
