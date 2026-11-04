import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { buildSeedData } from '../data/seed'
import { makeId } from '../utils/assignments'

const STORAGE_KEY = 'handin:data'
const FAKE_LATENCY_MS = 600

const DataContext = createContext(null)

function readStore() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === null) return buildSeedData() // first visit
  const parsed = JSON.parse(raw) // throws on corrupted data, caught by the caller
  if (!Array.isArray(parsed.assignments) || !Array.isArray(parsed.submissions)) {
    throw new Error('Saved data has an unexpected shape')
  }
  return parsed
}

export function DataProvider({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [attempt, setAttempt] = useState(0)

  
  useEffect(() => {
    setStatus('loading')
    const timer = setTimeout(() => {
      try {
        const data = readStore()
        setAssignments(data.assignments)
        setSubmissions(data.submissions)
        setStatus('ready')
      } catch (e) {
        setError(e)
        setStatus('error')
      }
    }, FAKE_LATENCY_MS)
    return () => clearTimeout(timer)
  }, [attempt])

  useEffect(() => {
    if (status !== 'ready') return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, assignments, submissions }),
      )
    } catch {
      /* storage full*/
    }
  }, [status, assignments, submissions])

  const createAssignment = useCallback((adminId, fields) => {
    const created = { id: makeId('a'), adminId, createdAt: new Date().toISOString(), ...fields }
    setAssignments((prev) => [created, ...prev])
    return created
  }, [])

  const updateAssignment = useCallback((id, fields) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...fields } : a)))
    if (fields.assignedTo && fields.assignedTo !== 'all') {
      setSubmissions((prev) =>
        prev.filter((s) => s.assignmentId !== id || fields.assignedTo.includes(s.studentId)),
      )
    }
  }, [])

  const deleteAssignment = useCallback((id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== id))
  }, [])

  const markSubmitted = useCallback((assignmentId, studentId) => {
    setSubmissions((prev) => {
      if (prev.some((s) => s.assignmentId === assignmentId && s.studentId === studentId)) return prev
      return [...prev, { assignmentId, studentId, submittedAt: new Date().toISOString() }]
    })
  }, [])

  const resetData = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing to do */
    }
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const value = useMemo(
    () => ({
      status,
      error,
      assignments,
      submissions,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      markSubmitted,
      resetData,
      retry,
    }),
    [status, error, assignments, submissions, createAssignment, updateAssignment, deleteAssignment, markSubmitted, resetData, retry],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
