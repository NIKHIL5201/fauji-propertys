import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const AddProperty: React.FC = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const { apiFetch } = useAuth()

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const uploadToCloudinary = async (file: File) => {
    // Request signature from backend using apiFetch to include auth
    const signRes = await apiFetch(`${API_URL}/api/uploads/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'fauji-properties' }),
    })
    if (!signRes.ok) throw new Error('Failed to get upload signature')
    const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json()

    const form = new FormData()
    form.append('file', file)
    form.append('api_key', apiKey)
    form.append('timestamp', timestamp)
    form.append('signature', signature)
    if (folder) form.append('folder', folder)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Cloudinary upload failed')
    return await res.json()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const images: any[] = []
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          // upload sequentially to simplify error handling
          // could be parallelized
          // eslint-disable-next-line no-await-in-loop
          const uploadRes = await uploadToCloudinary(files[i])
          images.push({ public_id: uploadRes.public_id, url: uploadRes.secure_url })
        }
      }

      const body = { title, price: Number(price || 0), images }
      // Use apiFetch so Authorization header is included and refresh handled
      const createRes = await apiFetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!createRes.ok) {
        const text = await createRes.text()
        throw new Error(`Create property failed: ${text}`)
      }
      alert('Property created')
      setTitle('')
      setPrice('')
      setFiles(null)
    } catch (err: any) {
      console.error(err)
      alert('Error: ' + (err.message || 'Unknown'))
    } finally {
      setLoading(false)
    }
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
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
          <div style={{fontSize: 12, color: '#666'}}>Images are uploaded to Cloudinary and then property is created.</div>
        </div>
        <button type="submit" style={{padding: '8px 12px'}} disabled={loading}>{loading ? 'Saving...' : 'Create Property'}</button>
      </form>
    </div>
  )
}

export default AddProperty
