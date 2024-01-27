/* eslint-disable camelcase */
import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'

import {
  createHash,
  generateToken,
  isValidPassword
} from '../utils.js'
import config from './config.js'
import {
  UserServices,
  CartServices
} from '../repositories/index.js'
import { use } from 'chai'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const cookieExtractor = req => (req && req.signedCookies) ? req.signedCookies[config.strategy.cookieName] : null

const registerUser = async (req, username, password, done) => {
  try {
    const { first_name, last_name, email, age } = req.body
    const user = await UserServices.getByEmail(username)
    if (user) {
      return done(null, false)
    }
    const cartUser = await CartServices.create()

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cartUser,
      role: (email === config.config.adminEmail) ? 'admin' : 'user'
    }

    const result = await UserServices.create(newUser)
    return done(null, result)
  } catch (err) {
    return done(err)
  }
}

const loginUser = async (username, password, done) => {
  try {
    const user = await UserServices.getByEmail(username)
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
}

const JWTTokens = async (jwt_payload, done) => {
  try {
    return done(null, jwt_payload)
  } catch (err) {
    return done(err)
  }
}

const githubcallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const emailProfile = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null

    const user = await UserServices.getByEmail(emailProfile)

    if (!user) {
      const cartUser = await CartServices.create()
      const newUser = {
        first_name: profile._json.name,
        last_name: 'user_github',
        age: 18,
        email: emailProfile,
        password: '',
        cart: cartUser,
        role: 'user'
      }
      const result = await UserServices.create(newUser)
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
}

// Función para inicializar Passport con estrategias de registro e inicio de sesión
const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, registerUser))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, loginUser))

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.strategy.key
  }, JWTTokens))

  passport.use('github', new GitHubStrategy({
    clientID: config.strategy.clientId,
    clientSecret: config.strategy.clientSecret,
    callbackURL: 'http://localhost:8080/api/session/githubcallback',
    scope: ['user', 'user:email']
  }, githubcallback))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserServices.getById(id)
    done(null, user)
  })
}

export default initializePassport
