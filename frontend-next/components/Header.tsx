import React from 'react'
import Link from 'next/link'

const Header: React.FC = () => (
  <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px'}}>
    <div>
      <Link href="/">
        <a style={{textDecoration: 'none', color: '#111', fontWeight: 700}}>Fauji Propertys</a>
      </Link>
    </div>
    <nav>
      <Link href="/">Home</Link> {' | '}
      <Link href="/contact">Contact</Link>
    </nav>
  </header>
)

export default Header
