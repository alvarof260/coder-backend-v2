import express from 'express'
import mongoose from 'mongoose'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import { messagesModel } from './dao/models/message.js'
import productsRouter from './routes/product.js'
import cartsRouter from './routes/cart.js'
import viewsRouter from './routes/view.js'
import chatRouter from './routes/chat.js'

const app = express()

configExpressApp(app)

try {
  mongoose.connect('mongodb+srv://alvarof260:delfina2@cluster0.cmr6jcw.mongodb.net/', {
    dbName: 'ecommerce'
  })
  console.log('DB connect.')
  // Routers de los endpoints de la API
  app.get('/', (req, res) => res.render('index'))
  app.use('/api/products', productsRouter)
  app.use('/api/carts', cartsRouter)
  app.use('/products', viewsRouter)
  app.use('/chat', chatRouter)

  const httpServer = app.listen(8080, () => console.log('http://localhost:8080'))
  initializeSocket(httpServer, messagesModel)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
