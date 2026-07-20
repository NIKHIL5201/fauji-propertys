import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import AddProperty from './pages/AddProperty'
import { AuthProvider, useAuth } from './AuthContext'

const HeaderNav: React.FC = () => {
  const { token, user, logout } = useAuth()
  const navStyle = { display: 'flex', gap: 12, alignItems: 'center' }
  return (
    <nav style={navStyle as any}>
      <Link to="/">Home</Link>
      <Link to="/add-property">Add Property</Link>
      {token ? (
        <>
          <span style={{fontSize: 13}}>Hi, {user?.name || 'Admin'}</span>
          <button onClick={() => logout()} style={{padding: '6px 8px'}}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  )
}

const AppRoutes: React.FC = () => {
  return (
    <main style={{marginTop: 20}}>
      <Routes>
        <Route path="/" element={<div>Welcome to Admin</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-property" element={<AddProperty />} />
      </Routes>
    </main>
  )
}

const AppShell: React.FC = () => {
  return (
    <div style={{fontFamily: 'Inter, system-ui', padding: 20}}>
      <header style={{display:'flex', justifyContent:'space-between'}}>
        <h2>Admin — Fauji Propertys</h2>
        <HeaderNav />
      </header>
      <AppRoutes />
    </div>
  )
}

const App: React.FC = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
)

export default App
