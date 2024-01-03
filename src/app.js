import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'

const app = express()

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

app.listen(8080, () => console.log('http://localhost:8080'))
