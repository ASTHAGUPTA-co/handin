import { isPastDue } from './dates'

export function getAssignedStudents(assignment, students) {
  if (assignment.assignedTo === 'all') return students
  return students.filter((s) => assignment.assignedTo.includes(s.id))
}

export function isAssignedTo(assignment, studentId) {
  return assignment.assignedTo === 'all' || assignment.assignedTo.includes(studentId)
}

export function findSubmission(submissions, assignmentId, studentId) {
  return submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  )
}

export function getStatus(assignment, studentId, submissions, now = new Date()) {
  if (findSubmission(submissions, assignment.id, studentId)) return 'submitted'
  return isPastDue(assignment.dueDate, now) ? 'overdue' : 'pending'
}

export function getCompletion(assignment, students, submissions) {
  const assigned = getAssignedStudents(assignment, students)
  const done = assigned.filter((s) =>
    findSubmission(submissions, assignment.id, s.id),
  ).length
  const total = assigned.length
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export function sortByDue(list, direction = 'asc') {
  const sorted = [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  return direction === 'asc' ? sorted : sorted.reverse()
}

export function makeId(prefix = 'a') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
