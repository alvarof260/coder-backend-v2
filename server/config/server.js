import express from 'express'
import handlebars from 'express-handlebars'
import passport from 'passport'
import initializePassport from './passport.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import { __dirname } from '../utils.js'
import config from './config.js'

const configExpressApp = (app) => {
  app.engine('handlebars', handlebars.engine())
  app.set('views', __dirname + '/views')
  app.set('view engine', 'handlebars')
  app.use(express.static(__dirname + '/public'))

  app.use(express.json()) // para que la informacion del body pueda pasarse a json
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser(config.strategy.key))
  app.use(
    session({
      secret: config.strategy.privateSession,
      resave: true,
      saveUninitialized: true
    })
  )
  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())
}

export default configExpressApp
