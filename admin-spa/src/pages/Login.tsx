import React from 'react'

const Login: React.FC = () => {
  return (
    <div style={{maxWidth: 420}}>
      <h3>Admin Login</h3>
      <form>
        <div style={{marginBottom: 8}}>
          <label>Email</label>
          <input type="email" name="email" style={{width: '100%', padding: 8}} />
        </div>
        <div style={{marginBottom: 8}}>
          <label>Password</label>
          <input type="password" name="password" style={{width: '100%', padding: 8}} />
        </div>
        <button type="submit" style={{padding: '8px 12px'}}>Login</button>
      </form>
    </div>
  )
}

export default Login
