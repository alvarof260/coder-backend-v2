import express from 'express'
import mongoose from 'mongoose'
import cluster from 'cluster'
import { cpus } from 'os'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import { MessageModel } from './dao/models/message.js'
import { passportCall } from './utils.js'
import config from './config/config.js'
import logger from './winston.js'
import productRouter from './routes/product.js'
import cartRouter from './routes/cart.js'
import loggerRouter from './routes/logger.js'
import chatRouter from './routes/chat.js'
import viewsRouter from './routes/view.js'
import viewSessionRouter from './routes/view-session.js'
import sessionRouter from './routes/session.js'

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died at ${Date()}`)
    cluster.fork()
  })
} else {
  const app = express()

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
    app.use('/loggerTest', loggerRouter)
    app.use('/chat', passportCall('jwt'), chatRouter)
    app.use('/products', passportCall('jwt'), viewsRouter)
    app.use('/carts', passportCall('jwt'), viewsRouter)
    app.use('/', viewSessionRouter)

    const httpServer = app.listen(config.config.port, () => logger.info('http://localhost:8080'))
    initializeSocket(httpServer, MessageModel)
  } catch (err) {
    logger.error(err.message)
    process.exit(1)
  }
}
