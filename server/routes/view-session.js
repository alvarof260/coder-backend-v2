import { Router } from 'express'
import { verifyToken, passportCall } from '../utils.js'
import config from '../config/config.js'

const router = Router()

// vista de login
router.get('/', (req, res) => {
  res.render('session/login', { title: 'CoderShop | Login', style: 'login.css' })
})

// vista de register
router.get('/register', (req, res) => {
  res.render('session/register', { title: 'CoderShop | Register', style: 'login.css' })
})

// vista de perfil
router.get('/profile', passportCall('jwt'), (req, res) => {
  const decoded = verifyToken(req.signedCookies[config.strategy.cookieName])
  res.render('session/profile', { title: 'CoderShop | Profile', style: 'login.css', user: decoded.user })
})

router.get('/failRegister', (req, res) => {
  res.status(401).json({ status: 'error', error: 'Passport register failed.' })
})

router.get('/failLogin', (req, res) => {
  res.status(401).json({ status: 'error', error: 'Passport login failed.' })
})

export default router
