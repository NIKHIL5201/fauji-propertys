import { Request, Response } from 'express'
import Property from '../models/property.model'

export const createProperty = async (req: Request, res: Response) => {
  const body = req.body
  const nextId = `FP-${Date.now()}`
  const slug = (body.title || 'property').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const p = new Property({ ...body, propertyId: nextId, slug })
  await p.save()
  return res.status(201).json({ ok: true, property: p })
}

export const listProperties = async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query as any
  const skip = (page - 1) * limit
  const items = await Property.find({ status: 'published' }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
  return res.json({ ok: true, items })
}

export const getProperty = async (req: Request, res: Response) => {
  const id = req.params.id || req.params.slug
  const item = await Property.findOne({ $or: [{ _id: id }, { slug: id }] })
  if (!item) return res.status(404).json({ message: 'Not found' })
  return res.json({ ok: true, item })
}
