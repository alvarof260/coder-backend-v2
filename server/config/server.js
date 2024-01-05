import express from 'express'
import handlebars from 'express-handlebars'
import { __dirname } from '../utils.js'

const configExpressApp = (app) => {
  app.engine('handlebars', handlebars.engine())
  app.set('views', __dirname + '/views')
  app.set('view engine', 'handlebars')
  app.use(express.static(__dirname + '/public'))
  app.use(express.json()) // para que la informacion del body pueda pasarse a json
  app.use(express.urlencoded({ extended: true }))
}

export default configExpressApp
