import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('samle_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export interface AuthResponse {
  token: string
  email: string
  displayName: string
  avatarUrl?: string
}

export const authService = {
  register: async (email: string, displayName: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, displayName, password })
    return data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },
}

export { api }
