import { Router } from 'express'
import passport from 'passport'

const router = Router()

// Ruta para manejar la autenticación de usuarios
router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin' }), async (req, res) => {
  // Almacenar información del usuario en la sesión y redirigir a la página de productos
  if (!req.user) {
    return res.status(400).json({ status: 'error', error: 'Invalid credentials.' })
  }
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  }
  res.redirect('/products')
})

// Ruta para manejar el registro de usuarios
router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), async (req, res) => {
  res.redirect('/')
})

// Ruta para manejar la desconexión de usuarios (logout)
router.get('/logout', (req, res) => {
  // Destruir la sesión y redirigir a la página principal
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ status: 'error', error: err })
    } else {
      res.redirect('/')
    }
  })
})
export default router
