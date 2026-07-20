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

  // In production set httpOnly cookie for refresh token
  res.cookie('jid', refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}
