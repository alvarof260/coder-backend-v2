import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('chat', { title: 'CoderShop | Chat', style: 'chat.css' })
})

export default router
