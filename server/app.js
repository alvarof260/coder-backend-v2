import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import { __dirname } from './utils.js'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'

const app = express()
const httpServer = app.listen(8080, () => console.log('http://localhost:8080'))
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(express.json()) // para que la informacion del body pueda pasarse a json
app.use(express.urlencoded({ extended: true })) // para poder trabajar con datos complejos con url.

// Routers de los endpoints de la API
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', viewsRouter)

socketServer.on('connection', socketClient => {
  console.log('New Client connected')
  socketClient.on('listProductUpdate', (data) => {
    socketServer.emit('listProduct', data)
  })
})
