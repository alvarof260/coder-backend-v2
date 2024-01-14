import express from 'express'
import mongoose from 'mongoose'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import { messageModel } from './dao/models/message.js'
import { passportCall } from './utils.js'
import productRouter from './routes/product.js'
import cartRouter from './routes/cart.js'
import viewsRouter from './routes/view.js'
import chatRouter from './routes/chat.js'
import viewSessionRouter from './routes/view-session.js'
import sessionRouter from './routes/session.js'

export const PORT = process.env.PORT || 8080

const app = express()

configExpressApp(app)

try {
  mongoose.connect('mongodb+srv://alvarof260:delfina2@cluster0.cmr6jcw.mongodb.net/', {
    dbName: 'ecommerce'
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

  const httpServer = app.listen(PORT, () => console.log('http://localhost:8080'))
  initializeSocket(httpServer, messageModel)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
