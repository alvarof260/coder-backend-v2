import express from 'express'
import productRouter from './routes/products.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // para poder trabajar con datos complejos con url.

app.get('/', (req, res) => {
  res.send('Hola Mundo!')
})

app.use('/api/products', productRouter) // trabajo con el router de productos
app.use('/api/carts', productRouter)

app.listen(8080, () => console.log('http://localhost:8080'))
