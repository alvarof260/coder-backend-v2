/* eslint-disable camelcase */
import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'

import { userModel } from '../dao/models/user.js'
import { cartModel } from '../dao/models/cart.js'
import {
  PRIVATE_KEY,
  COOKIE_NAME,
  createHash,
  generateToken,
  isValidPassword
} from '../utils.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const cookieExtractor = req => (req && req.signedCookies) ? req.signedCookies[COOKIE_NAME] : null

// Función para inicializar Passport con estrategias de registro e inicio de sesión
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
      const cartUser = await cartModel.create({})

      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cart: cartUser,
        role: (email === 'admin@coder.com') ? 'admin' : 'user'
      }

      console.log(newUser)

      const result = await userModel.create(newUser)
      return done(null, result)
    } catch (err) {
      return done(err)
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username })
      if (!user) {
        return done(null, user)
      }
      if (!isValidPassword(user, password)) {
        return done(null, false)
      }
      const token = generateToken(user)
      user.token = token

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }))

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload)
    } catch (err) {
      return done(err)
    }
  }))

  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.4e4b1ccdee2e8a72',
    clientSecret: '2bc2d14598275ec08981bda1e53bc708aa103f13',
    callbackURL: 'http://localhost:8080/api/session/githubcallback',
    scope: ['user', 'user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile)
      const emailProfile = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null
      console.log(emailProfile)
      const user = await userModel.findOne({ email: emailProfile })
      console.log(user)
      if (!user) {
        const cartUser = await cartModel.create({})
        const newUser = {
          first_name: profile._json.name,
          last_name: 'user_github',
          age: 18,
          email: emailProfile,
          password: '',
          cart: cartUser,
          role: 'user'
        }
        const result = await userModel.create(newUser)
        const token = generateToken(result)
        result.token = token
        done(null, result)
      } else {
        const token = generateToken(user)
        user.token = token
        done(null, user)
      }
    } catch (err) {
      return done(err)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}

export default initializePassport
