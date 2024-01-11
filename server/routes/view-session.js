import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('session/login', { title: 'Coder Shop | Login', style: 'login.css' })
})

export default router
