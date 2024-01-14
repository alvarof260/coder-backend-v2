import { Router } from 'express'
import { passportCall } from '../utils.js'

const router = Router()

router.get('/', passportCall('jwt'), (req, res) => {
  res.render('chat', { title: 'CoderShop | Chat', style: 'chat.css' })
})

export default router
