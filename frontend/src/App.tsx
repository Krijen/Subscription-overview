import { Navigate, Routes, Route } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import DashboardPage from '@/pages/DashboardPage'
import SubscriptionsPage from '@/pages/SubscriptionsPage'
import AddSubscriptionPage from '@/pages/AddSubscriptionPage'
import EditSubscriptionPage from '@/pages/EditSubscriptionPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="subscriptions/add" element={<AddSubscriptionPage />} />
        <Route path="subscriptions/:id/edit" element={<EditSubscriptionPage />} />
      </Route>
    </Routes>
  )
}
