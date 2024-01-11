import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('session/login', { title: 'CoderShop | Login', style: 'login.css' })
})

router.get('/register', (req, res) => {
  res.render('session/register', { title: 'CoderShop | Register', style: 'login.css' })
})

export default router
