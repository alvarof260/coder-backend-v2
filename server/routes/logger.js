import { Router } from 'express'
import { loggerTest } from '../controllers/logger.js'
const router = Router()

router.get('/', loggerTest)

export default router
