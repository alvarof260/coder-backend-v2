import express from 'express'
import handlebars from 'express-handlebars'
import passport from 'passport'
import initializePassport from './passport.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import { __dirname, PRIVATE_KEY } from '../utils.js'

const configExpressApp = (app) => {
  app.engine('handlebars', handlebars.engine())
  app.set('views', __dirname + '/views')
  app.set('view engine', 'handlebars')
  app.use(express.static(__dirname + '/public'))

  app.use(express.json()) // para que la informacion del body pueda pasarse a json
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser(PRIVATE_KEY))
  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  )
  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())
}

export default configExpressApp
