import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'

interface AuthUser {
  email: string
  displayName: string
  avatarUrl?: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, displayName: string, password: string) => Promise<void>
  loginWithToken: (token: string, email: string, displayName: string, avatarUrl?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('samle_token')
    const email = localStorage.getItem('samle_email')
    const displayName = localStorage.getItem('samle_display_name')
    const avatarUrl = localStorage.getItem('samle_avatar_url') ?? undefined
    if (token && email && displayName) {
      setUser({ email, displayName, avatarUrl })
    }
    setLoading(false)
  }, [])

  const storeAndSetUser = useCallback((token: string, email: string, displayName: string, avatarUrl?: string) => {
    localStorage.setItem('samle_token', token)
    localStorage.setItem('samle_email', email)
    localStorage.setItem('samle_display_name', displayName)
    if (avatarUrl) localStorage.setItem('samle_avatar_url', avatarUrl)
    else localStorage.removeItem('samle_avatar_url')
    setUser({ email, displayName, avatarUrl })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    storeAndSetUser(res.token, res.email, res.displayName, res.avatarUrl ?? undefined)
  }, [storeAndSetUser])

  const register = useCallback(async (email: string, displayName: string, password: string) => {
    const res = await authService.register(email, displayName, password)
    storeAndSetUser(res.token, res.email, res.displayName, res.avatarUrl ?? undefined)
  }, [storeAndSetUser])

  const loginWithToken = useCallback((token: string, email: string, displayName: string, avatarUrl?: string) => {
    storeAndSetUser(token, email, displayName, avatarUrl)
  }, [storeAndSetUser])

  const logout = useCallback(() => {
    localStorage.removeItem('samle_token')
    localStorage.removeItem('samle_email')
    localStorage.removeItem('samle_display_name')
    localStorage.removeItem('samle_avatar_url')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
