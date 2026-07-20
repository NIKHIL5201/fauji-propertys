import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import mongoose from 'mongoose'
import { json, urlencoded } from 'express'

import authRoutes from './routes/auth'
import propertyRoutes from './routes/properties'
import uploadRoutes from './routes/uploads'
import { connectDB } from './config/db'

const app = express()

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(mongoSanitize())

if (process.env.MONGO_URI) {
  connectDB().catch(err => {
    console.error('DB connection failed', err)
    process.exit(1)
  })
} else {
  console.warn('MONGO_URI not set — skipping DB connection (development scaffold)')
}

app.get('/', (req, res) => res.json({ ok: true, service: 'Fauji Propertys API' }))

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/uploads', uploadRoutes)

export default app
