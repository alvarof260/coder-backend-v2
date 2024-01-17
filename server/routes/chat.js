import { Router } from 'express'
import { passportCall } from '../utils.js'
import { handlePolicies } from '../middlewares/auth.js'

const router = Router()

router.get('/', passportCall('jwt'), handlePolicies(['USER']), (req, res) => {
  res.render('chat', { title: 'CoderShop | Chat', style: 'chat.css' })
})

export default router
