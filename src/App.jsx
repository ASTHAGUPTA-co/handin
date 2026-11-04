import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import Header from './components/layout/Header'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { ErrorState, LoadingScreen } from './components/ui/States'

function Shell() {
  const { user } = useAuth()
  const { status, error, retry, resetData } = useData()

  if (!user) return <Login />

  return (
    <>
      <Header />
      {status === 'loading' && <LoadingScreen />}
      {status === 'error' && (
        <ErrorState message={error?.message} onRetry={retry} onReset={resetData} />
      )}
      {status === 'ready' && (user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />)}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Shell />
      </DataProvider>
    </AuthProvider>
  )
}
