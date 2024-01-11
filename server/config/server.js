import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './passport.js'
import { __dirname } from '../utils.js'

const configExpressApp = (app) => {
  app.use(session({
    store: new MongoStore({
      mongoUrl: 'mongodb+srv://alvarof260:delfina2@cluster0.cmr6jcw.mongodb.net/',
      dbName: 'ecommerce'
    }),
    secret: 'secret-ecommerce',
    resave: true,
    saveUninitialized: true
  }))

  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())

  app.engine('handlebars', handlebars.engine())
  app.set('views', __dirname + '/views')
  app.set('view engine', 'handlebars')
  app.use(express.static(__dirname + '/public'))
  app.use(express.json()) // para que la informacion del body pueda pasarse a json
  app.use(express.urlencoded({ extended: true }))
}

export default configExpressApp
