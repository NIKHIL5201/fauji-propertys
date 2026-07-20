import { Request, Response } from 'express'
import cloudinary from '../utils/cloudinary'

export const getSignature = async (req: Request, res: Response) => {
  try {
    const origin = (req.headers.origin || req.headers.referer || '') as string
    const allowed = [process.env.ADMIN_FRONTEND_URL, process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:5173', 'http://localhost:3000']
    const { folder } = req.body || {}

    if (process.env.NODE_ENV === 'production') {
      // In production enforce allowed origin or authenticated requests only
      if (!allowed.includes(origin)) {
        return res.status(403).json({ message: 'Forbidden origin' })
      }
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign: any = { timestamp }
    if (folder) paramsToSign.folder = folder
    // @ts-ignore - cloudinary typings may not expose utils
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET)

    return res.json({ ok: true, signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME, folder: folder || null })
  } catch (err) {
    console.error('upload signature error', err)
    return res.status(500).json({ message: 'Failed to create signature' })
  }
}
