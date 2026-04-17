import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Google redirects back to /auth/callback?token=...&email=...&displayName=...&avatarUrl=...
// This page reads those params, stores them, and redirects to the dashboard.
export default function AuthCallbackPage() {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const email = params.get('email')
    const displayName = params.get('displayName')
    const avatarUrl = params.get('avatarUrl') || undefined
    const error = params.get('error')

    if (error || !token || !email || !displayName) {
      navigate('/login?error=google_failed', { replace: true })
      return
    }

    loginWithToken(token, email, displayName, avatarUrl)
    navigate('/', { replace: true })
  }, [loginWithToken, navigate])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 32, height: 32, border: '2px solid #252a38',
        borderTopColor: '#5b7fff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Signing you in…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
