import { Router } from 'express'
import { passportCall } from '../utils.js'
import {
  loginViewController as login,
  registerViewController as register,
  profileViewController as profile,
  failRegisterViewController as failRegister,
  failLoginViewController as failLogin
} from '../controllers/view.js'

const router = Router()

// vista de login
router.get('/', login)

// vista de register
router.get('/register', register)

// vista de perfil
router.get('/profile', passportCall('jwt'), profile)

// vista de error en register
router.get('/failRegister', failRegister)

// vista de error en login
router.get('/failLogin', failLogin)

export default router
