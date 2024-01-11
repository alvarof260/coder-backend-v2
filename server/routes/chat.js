import { Router } from 'express'
import { publicRoutes } from '../middlewares/auth.js'

const router = Router()

router.get('/', publicRoutes, (req, res) => {
  res.render('chat', { title: 'CoderShop | Chat', style: 'chat.css' })
})

export default router
