import React, { useState } from 'react'

const AddProperty: React.FC = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    // POST to backend API /api/properties (to be implemented)
    alert('Property submitted (scaffold)')
  }

  return (
    <div style={{maxWidth: 760}}>
      <h3>Add Property</h3>
      <form onSubmit={submit}>
        <div style={{marginBottom: 8}}>
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{width: '100%', padding: 8}} />
        </div>
        <div style={{marginBottom: 8}}>
          <label>Price</label>
          <input value={price} onChange={e => setPrice(e.target.value)} style={{width: '100%', padding: 8}} />
        </div>
        <div style={{marginBottom: 8}}>
          <label>Images</label>
          <input type="file" accept="image/*" multiple />
          <div style={{fontSize: 12, color: '#666'}}>Images will be uploaded directly to Cloudinary in production.</div>
        </div>
        <button type="submit" style={{padding: '8px 12px'}}>Create Property</button>
      </form>
    </div>
  )
}

export default AddProperty
