import { Router } from 'express'
import passport from 'passport'
import {
  loginController as login,
  registerController as register,
  githubController as github,
  githubCallbackController as githubCallback,
  logoutController as logout,
  forgetPasswordController as forgetPassword,
  verifyTokenController as verifyToken,
  resetPasswordController as resetPassword
} from '../controllers/session.js'

const router = Router()

// Ruta para manejar la autenticación de usuarios
router.post('/login', passport.authenticate('login', { session: false }), login)

// Ruta para manejar el registro de usuarios
router.post('/register', passport.authenticate('register', { session: false }), register)

// Ruta para manejar el olvido de contraseña
router.post('/forget-password', forgetPassword)

router.get('/verify-token/:token', verifyToken)

router.post('/reset-password/:token', resetPassword)

// Ruta para manejar el registro desde cuenta de github
router.get('/github', passport.authenticate('github'), github)

// Ruta donde recibe los datos de github
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), githubCallback)

// Ruta para manejar la desconexión de usuarios (logout)
router.get('/logout', logout)

export default router
