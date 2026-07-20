import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  propertyId: string
  title: string
  slug: string
  description?: string
  price?: number
  currency?: string
  status?: string
  propertyType?: string
  bhk?: number
  area?: number
  address?: {
    line1?: string
    locality?: string
    city?: string
    state?: string
    pincode?: string
  }
  geolocation?: { type: string; coordinates: number[] }
  images?: { public_id: string; url: string; alt?: string }[]
  createdAt: Date
  updatedAt: Date
}

const PropertySchema: Schema = new Schema(
  {
    propertyId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number },
    currency: { type: String, default: 'INR' },
    status: { type: String, default: 'draft' },
    propertyType: { type: String },
    bhk: { type: Number },
    area: { type: Number },
    address: { type: Object },
    geolocation: { type: { type: String }, coordinates: { type: [Number] } },
    images: [{ public_id: String, url: String, alt: String }],
  },
  { timestamps: true }
)

PropertySchema.index({ geolocation: '2dsphere' })
PropertySchema.index({ title: 'text', description: 'text' })

export default mongoose.model<IProperty>('Property', PropertySchema)
