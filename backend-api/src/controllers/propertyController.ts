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
  try {
    const { page = 1, limit = 12, city, propertyType, minPrice, maxPrice } = req.query as any
    const skip = (page - 1) * limit
    const filter: any = { status: 'published' }
    if (city) filter['address.city'] = city
    if (propertyType) filter.propertyType = propertyType
    if (minPrice || maxPrice) filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
    const items = await Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
    return res.json({ ok: true, items })
  } catch (err) {
    console.error('listProperties', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getProperty = async (req: Request, res: Response) => {
  const id = req.params.id || req.params.slug
  const item = await Property.findOne({ $or: [{ _id: id }, { slug: id }] })
  if (!item) return res.status(404).json({ message: 'Not found' })
  return res.json({ ok: true, item })
}

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body
    const updated = await Property.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ ok: true, property: updated })
  } catch (err) {
    console.error('updateProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const removed = await Property.findByIdAndDelete(id)
    if (!removed) return res.status(404).json({ message: 'Not found' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('deleteProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const duplicateProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const orig = await Property.findById(id)
    if (!orig) return res.status(404).json({ message: 'Not found' })
    const copy = orig.toObject()
    delete copy._id
    copy.propertyId = `FP-${Date.now()}`
    copy.slug = `${copy.slug || 'property'}-copy-${Date.now()}`
    const p = new Property(copy)
    await p.save()
    return res.json({ ok: true, property: p })
  } catch (err) {
    console.error('duplicateProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const archiveProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const updated = await Property.findByIdAndUpdate(id, { status: 'archived' }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ ok: true, property: updated })
  } catch (err) {
    console.error('archiveProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const publishProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const updated = await Property.findByIdAndUpdate(id, { status: 'published', publishedAt: new Date() }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ ok: true, property: updated })
  } catch (err) {
    console.error('publishProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const unpublishProperty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const updated = await Property.findByIdAndUpdate(id, { status: 'draft' }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.json({ ok: true, property: updated })
  } catch (err) {
    console.error('unpublishProperty', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
