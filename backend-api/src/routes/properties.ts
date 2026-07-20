import { Router } from 'express'
import { createProperty, listProperties, getProperty, updateProperty, deleteProperty, duplicateProperty, archiveProperty, publishProperty, unpublishProperty } from '../controllers/propertyController'
import { ensureAuth } from '../middleware/auth'

const router = Router()
router.get('/', listProperties)
router.get('/:id', getProperty)
router.post('/', ensureAuth, createProperty)
router.put('/:id', ensureAuth, updateProperty)
router.delete('/:id', ensureAuth, deleteProperty)
router.post('/:id/duplicate', ensureAuth, duplicateProperty)
router.post('/:id/archive', ensureAuth, archiveProperty)
router.post('/:id/publish', ensureAuth, publishProperty)
router.post('/:id/unpublish', ensureAuth, unpublishProperty)

export default router
