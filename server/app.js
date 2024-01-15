import express from 'express'
import mongoose from 'mongoose'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import { messageModel } from './dao/models/message.js'
import { passportCall } from './utils.js'
import config from './config/config.js'
import productRouter from './routes/product.js'
import cartRouter from './routes/cart.js'
import viewsRouter from './routes/view.js'
import chatRouter from './routes/chat.js'
import viewSessionRouter from './routes/view-session.js'
import sessionRouter from './routes/session.js'

const app = express()

console.log(config.mongo.url)

configExpressApp(app)

try {
  mongoose.connect(config.mongo.url, {
    dbName: config.mongo.dbName
  })
  console.log('DB connect.')
  // Routers de los endpoints de la API
  app.use('/api/session', sessionRouter)
  app.use('/api/products', productRouter)
  app.use('/api/carts', cartRouter)
  app.use('/chat', passportCall('jwt'), chatRouter)
  app.use('/products', passportCall('jwt'), viewsRouter)
  app.use('/carts', passportCall('jwt'), viewsRouter)
  app.use('/', viewSessionRouter)

  const httpServer = app.listen(config.config.port, () => console.log('http://localhost:8080'))
  initializeSocket(httpServer, messageModel)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
