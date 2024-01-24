import { Router } from 'express'
import { changeRoleController as changeRole } from '../controllers/user.js'
import { passportCall } from '../utils.js'
import { handlePolicies } from '../middlewares/auth.js'

const router = Router()

router.get('/premium/:uid([a-fA-F0-9]{24})', passportCall('jwt'), handlePolicies(['USER', 'PREMIUM']), changeRole)

export default router
