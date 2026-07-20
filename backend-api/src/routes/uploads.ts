import { Router } from 'express'
import { getSignature } from '../controllers/uploadController'

const router = Router()
// Signing endpoint: in production this should require authentication.
// For development we allow requests from ADMIN_FRONTEND_URL or localhost.
router.post('/sign', getSignature)

export default router
