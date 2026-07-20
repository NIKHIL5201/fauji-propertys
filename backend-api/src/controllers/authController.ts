import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'User exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = new User({ name, email, passwordHash: hash })
  await user.save()
  return res.json({ ok: true })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })

  const payload = { sub: user._id, role: user.role }
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' })
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'devrefresh', { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' })

  // Send refresh token as httpOnly cookie
  res.cookie('jid', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  })
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.jid || req.headers['x-refresh-token']
    if (!token) return res.status(401).json({ message: 'No refresh token' })
    const decoded = jwt.verify(token as string, process.env.JWT_REFRESH_SECRET || 'devrefresh') as any
    const user = await User.findById(decoded.sub)
    if (!user) return res.status(401).json({ message: 'Invalid token' })
    const payload = { sub: user._id, role: user.role }
    const access = jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' })
    return res.json({ token: access, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('jid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  return res.json({ ok: true })
}
