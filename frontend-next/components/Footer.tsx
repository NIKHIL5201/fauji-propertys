import React from 'react'

const Footer: React.FC = () => (
  <footer style={{padding: 24, borderTop: '1px solid #eee', marginTop: 48}}>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div>
        <strong>Fauji Propertys</strong>
        <div>Trusted Property Dealer in Kanpur</div>
      </div>
      <div>© {new Date().getFullYear()} Fauji Propertys</div>
    </div>
  </footer>
)

export default Footer
