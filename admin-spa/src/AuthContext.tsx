import React, { createContext, useContext, useState } from 'react'

type AuthContextType = {
  token: string | null
  user: any | null
  setAuth: (token: string | null, user?: any | null) => void
  apiFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)

  const setAuth = (t: string | null, u: any | null = null) => {
    setToken(t)
    setUser(u)
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch (err) {
      // ignore
    }
    setAuth(null, null)
  }

  const refresh = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
      if (!res.ok) return null
      const data = await res.json()
      if (data.token) setToken(data.token)
      if (data.user) setUser(data.user)
      return data.token
    } catch (err) {
      return null
    }
  }

  const apiFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    init.headers = init.headers || {}
    // @ts-ignore
    if (token) init.headers = { ...(init.headers as any), Authorization: `Bearer ${token}` }
    init.credentials = 'include'

    let res = await fetch(input, init)
    if (res.status === 401) {
      const newToken = await refresh()
      if (newToken) {
        // retry once
        init.headers = { ...(init.headers as any), Authorization: `Bearer ${newToken}` }
        res = await fetch(input, init)
      }
    }
    return res
  }

  return (
    <AuthContext.Provider value={{ token, user, setAuth, apiFetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
