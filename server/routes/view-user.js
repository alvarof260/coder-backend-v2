import { Router } from 'express'

import { usersViewController as usersView } from '../controllers/view.js'

const router = Router()

router.get('/', usersView)

export default router
