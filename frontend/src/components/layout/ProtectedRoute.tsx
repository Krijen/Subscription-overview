import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{
          width: 32, height: 32, border: '2px solid #252a38',
          borderTopColor: '#5b7fff', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}
