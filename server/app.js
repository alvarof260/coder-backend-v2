import express from 'express'

import configExpressApp from './config/server.js'
import initializeSocket from './socket.js'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'

const app = express()
const httpServer = app.listen(8080, () => console.log('http://localhost:8080'))

configExpressApp(app)

// Routers de los endpoints de la API
app.get('/', (req, res) => res.render('index'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', viewsRouter)

initializeSocket(httpServer)
