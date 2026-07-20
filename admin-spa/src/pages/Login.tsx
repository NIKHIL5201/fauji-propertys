import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      // data.token is access token; refresh token is set as httpOnly cookie
      setAuth(data.token, data.user)
      nav('/add-property')
    } catch (err: any) {
      alert(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth: 420}}>
      <h3>Admin Login</h3>
      <form onSubmit={submit}>
        <div style={{marginBottom: 8}}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" style={{width: '100%', padding: 8}} />
        </div>
        <div style={{marginBottom: 8}}>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" style={{width: '100%', padding: 8}} />
        </div>
        <button type="submit" style={{padding: '8px 12px'}} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}

export default Login
