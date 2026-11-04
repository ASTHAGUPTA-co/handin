import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { USERS } from '../data/seed'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [userId, setUserId] = useLocalStorage('handin:session', null)

  const user = useMemo(() => USERS.find((u) => u.id === userId) ?? null, [userId])

  const value = useMemo(
    () => ({
      user,
      users: USERS,
      students: USERS.filter((u) => u.role === 'student'),
      login: (id) => setUserId(id),
      logout: () => setUserId(null),
    }),
    [user, setUserId],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
