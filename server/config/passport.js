/* eslint-disable camelcase */
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'

import { userModel } from '../dao/models/user.js'
import { PRIVATE_KEY } from '../utils.js'

const JWTStrategy = jwt.Strategy

const cookieExtractor = req => (req && req.signedCookies) ? req.signedCookies['jwt-token'] : null

// Función para inicializar Passport con estrategias de registro e inicio de sesión
const initializePassport = () => {
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
    callbackURL: 'http://localhost:8080/api/session/githubcallback'
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
      const user = await userModel.findOne({ email: profile._json.email })
      if (!user) {
        const newUser = {
          first_name: profile._json.name,
          last_name: '',
          age: 18,
          email: profile._json.email,
          password: ''
        }
        const result = await userModel.create(newUser)
        done(null, result)
      } else {
        done(null, user)
      }
    } catch (err) {
      return done(err)
    }
  }))
}

export default initializePassport
