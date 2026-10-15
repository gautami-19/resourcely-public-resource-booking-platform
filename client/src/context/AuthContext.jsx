import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    const token = localStorage.getItem('rb_token')
    if (!token) return setLoading(false)
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch {
      localStorage.removeItem('rb_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('rb_token', data.token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('rb_token', data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('rb_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>
    {children}
  </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
