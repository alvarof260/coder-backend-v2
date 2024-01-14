import { Router } from 'express'
import passport from 'passport'

import { COOKIE_NAME } from '../utils.js'

const router = Router()

// Ruta para manejar la autenticación de usuarios
router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(500).render('errors/base', { error: 'error in server ' })
    }
    res.cookie(COOKIE_NAME, req.user.token, { signed: true }).status(200).redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// Ruta para manejar el registro de usuarios
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
  res.redirect('/')
})

// Ruta para manejar el registro desde cuenta de github
router.get('/github', passport.authenticate('github'), (req, res) => {

})

// Ruta donde recibe los datos de github
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  console.log(req.user)
  try {
    if (!req.user) {
      return res.status(500).render('errors/base', { error: 'error in server ' })
    }
    res.cookie(COOKIE_NAME, req.user.token, { signed: true }).status(200).redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// Ruta para manejar la desconexión de usuarios (logout)
router.get('/logout', (req, res) => {
  // Destruir la sesión y redirigir a la página principal
  res.clearCookie(COOKIE_NAME).redirect('/')
})

export default router
