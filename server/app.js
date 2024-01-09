import express from 'express'
import mongoose from 'mongoose'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import { messageModel } from './dao/models/message.js'
import productRouter from './routes/product.js'
import cartRouter from './routes/cart.js'
import viewsRouter from './routes/view.js'
import chatRouter from './routes/chat.js'

export const PORT = process.env.PORT || 8080

const app = express()

configExpressApp(app)

try {
  mongoose.connect('mongodb+srv://alvarof260:delfina2@cluster0.cmr6jcw.mongodb.net/', {
    dbName: 'ecommerce'
  })
  console.log('DB connect.')
  // Routers de los endpoints de la API
  app.get('/', (req, res) => res.render('index'))
  app.use('/api/products', productRouter)
  app.use('/api/carts', cartRouter)
  app.use('/products', viewsRouter)
  app.use('/carts', viewsRouter)
  app.use('/chat', chatRouter)

  const httpServer = app.listen(PORT, () => console.log('http://localhost:8080'))
  initializeSocket(httpServer, messageModel)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
