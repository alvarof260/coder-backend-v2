import { Router } from 'express'
import {
  changeRoleController as changeRole,
  uploadDocumentsController as uploadDocuments
} from '../controllers/user.js'
import { passportCall, uploader } from '../utils.js'
import { handlePolicies } from '../middlewares/auth.js'

const router = Router()

router.get('/premium/:uid([a-fA-F0-9]{24})', passportCall('jwt'), handlePolicies(['USER', 'PREMIUM']), changeRole)
router.post('/:uid([a-fA-F0-9]{24})/documents', passportCall('jwt'), handlePolicies(['PREMIUM']), uploader.array('documents'), uploadDocuments)
export default router
