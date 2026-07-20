import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import AddProperty from './pages/AddProperty'

const App: React.FC = () => {
  return (
    <div style={{fontFamily: 'Inter, system-ui', padding: 20}}>
      <header style={{display:'flex', justifyContent:'space-between'}}>
        <h2>Admin — Fauji Propertys</h2>
        <nav>
          <Link to="/login">Login</Link> {' | '}
          <Link to="/add-property">Add Property</Link>
        </nav>
      </header>
      <main style={{marginTop: 20}}>
        <Routes>
          <Route path="/" element={<div>Welcome to Admin</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-property" element={<AddProperty />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
