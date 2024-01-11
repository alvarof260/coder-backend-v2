/* eslint-disable camelcase */
import passport from 'passport'
import local from 'passport-local'
import { userModel } from '../dao/models/user.js'
import { createHash } from '../utils.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    try {
      const { first_name, last_name, email, age } = req.body
      const user = await userModel.findOne({ email: username })
      if (user) {
        return done(null, false)
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
      }
      const result = await userModel.create(newUser)
      return done(null, result)
    } catch (err) {
      return done('Error al obtener el usuario' + err)
    }
  }
  ))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}

export default initializePassport
