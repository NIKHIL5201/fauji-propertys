import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Unauthorized' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Unauthorized' })
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    ;(req as any).user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
