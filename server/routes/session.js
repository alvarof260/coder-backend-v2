import { Router } from 'express'
import { userModel } from '../dao/models/user.js'
import { createHash, isValidPassword } from '../utils.js'
import passport from 'passport'

const router = Router()

// Ruta para manejar la autenticación de usuarios
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el email y la contraseña fueron proporcionados
    if (!email || !password) {
      return res.status(400).json({ status: 'error', error: 'Email and password are not optional.' })
    }

    // Buscar al usuario en la base de datos por su email
    const user = await userModel.findOne({ email })

    // Si el usuario no existe, devolver un error 401 (No autorizado)
    if (!user) {
      return res.status(401).json({ status: 'error', error: `User with email: ${email} not found.` })
    }

    // Verificar la validez de la contraseña usando una función externa (isValidPassword)
    if (!isValidPassword(user, password)) {
      return res.status(401).json({ status: 'error', error: 'The password is incorrect, try again.' })
    }

    // Asignar un rol de 'admin' si el usuario es el administrador predeterminado
    if (user.email === 'adminCoder@coder.com' && user.password === 'adminCoder123') {
      user.role = 'admin'
    } else {
      user.role = 'user'
    }

    // Almacenar información del usuario en la sesión y redirigir a la página de productos
    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role
    }
    res.redirect('/products')
  } catch (err) {
    // Manejar errores y devolver un código de estado 500 en caso de error interno del servidor
    res.status(500).json({ status: 'error', error: err.message })
  }
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
