import { Router } from 'express'
import passport from 'passport'

import { userModel } from '../dao/models/user.js'
import { generateToken, isValidPassword } from '../utils.js'

const router = Router()

// Ruta para manejar la autenticación de usuarios
router.post('/login', async (req, res) => {
  // Almacenar información del usuario en la sesión y redirigir a la página de productos
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ status: 'error', error: 'Email and password are not optional.' })
  }

  const user = await userModel.findOne({ email })
  if (!user) {
    return res.status(404).json({ status: 'error', error: `User with email: ${email} not found.` })
  }

  if (!isValidPassword(user, password)) return res.status(401).json({ status: 'error', error: 'The password is incorrect, try again.' })

  const accessToken = generateToken(user)
  res.cookie('jwt-token', accessToken, { signed: true }).status(200).json({ status: 'success', payload: accessToken })
})

// Ruta para manejar el registro de usuarios
router.post('/register', async (req, res) => {
  res.redirect('/')
})

// Ruta para manejar el registro desde cuenta de github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})

// Ruta donde recibe los datos de github
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  req.session.user = req.user
  res.redirect('/')
})

// Ruta para manejar la desconexión de usuarios (logout)
router.get('/logout', (req, res) => {
  // Destruir la sesión y redirigir a la página principal
  res.clearCookie('jwt-token').redirect('/')
})

export default router
