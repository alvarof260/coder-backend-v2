/* eslint-disable camelcase */
import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { userModel } from '../dao/models/user.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

// Función para inicializar Passport con estrategias de registro e inicio de sesión
const initializePassport = () => {
  // Estrategia de registro de usuarios
  passport.use('register', new LocalStrategy({
    passReqToCallback: true, // Permitir pasar el objeto de solicitud al callback
    usernameField: 'email' // Campo que se utilizará como nombre de usuario (en este caso, 'email')
  }, async (req, username, password, done) => {
    try {
      // Obtener datos del formulario de registro
      const { first_name, last_name, email, age } = req.body

      // Buscar si ya existe un usuario con el mismo correo electrónico
      const user = await userModel.findOne({ email: username })

      // Si el usuario ya existe, indicar que el registro ha fallado
      if (user) {
        return done(null, false)
      }

      // Crear un nuevo usuario en la base de datos
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password) // Crear un hash de la contraseña antes de almacenarla
      }

      const result = await userModel.create(newUser)

      // Indicar que el registro fue exitoso y devolver el nuevo usuario
      return done(null, result)
    } catch (err) {
      // Manejar errores en caso de fallo
      return done('Error al obtener el usuario' + err)
    }
  }))

  // Estrategia de inicio de sesión
  passport.use('login', new LocalStrategy({
    usernameField: 'email' // Campo que se utilizará como nombre de usuario para el inicio de sesión
  }, async (username, password, done) => {
    try {
      // Buscar un usuario con el correo electrónico proporcionado
      const user = await userModel.findOne({ email: username })

      // Si no se encuentra el usuario, indicar que el inicio de sesión ha fallado
      if (!user) {
        return done(null, user)
      }

      // Verificar la contraseña utilizando la función isValidPassword
      if (!isValidPassword(user, password)) {
        return done(null, false)
      }

      // Si la contraseña es válida, indicar que el inicio de sesión fue exitoso
      return done(null, user)
    } catch (err) {
      // Manejar errores en caso de fallo
      // Aquí podrías agregar algún tipo de registro de errores
    }
  }))

  // Función para serializar al usuario para almacenar en la sesión
  passport.serializeUser((user, done) => {
    done(null, user._id) // Almacenar solo el ID del usuario en la sesión
  })

  // Función para deserializar al usuario a partir del ID almacenado en la sesión
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id) // Recuperar el usuario a partir del ID
    done(null, user) // Devolver el usuario para ser almacenado en el objeto de solicitud (req.user)
  })
}

export default initializePassport
