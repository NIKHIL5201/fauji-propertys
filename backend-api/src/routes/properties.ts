import { Router } from 'express'
import { createProperty, listProperties, getProperty } from '../controllers/propertyController'
import { ensureAuth } from '../middleware/auth'

const router = Router()
router.get('/', listProperties)
router.get('/:id', getProperty)
router.post('/', ensureAuth, createProperty)

export default router
