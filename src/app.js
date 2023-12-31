import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // para poder trabajar con datos complejos con url.

app.get('/', (req, res) => {
  res.send('Hola Mundo!')
})

app.use('/api/products', productsRouter) // trabajo con el router de productos
app.use('/api/carts', cartsRouter)

app.listen(8080, () => console.log('http://localhost:8080'))
