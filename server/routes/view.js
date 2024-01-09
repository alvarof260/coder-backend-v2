import { Router } from 'express'
import { productModel } from '../dao/models/product.js'
import { getProducts } from './product.js'
import { PORT } from '../app.js'
// import { ProductManager } from '../dao/fs/product-manager.js'

const router = Router()
// const PM = new ProductManager('./server/data/products.json')

router.get('/', async (req, res) => {
  // Llamada a la función getProducts para obtener los datos
  const result = await getProducts(req, res)
  console.log(result) // Mostrar el resultado en la consola

  // Verificar el estado de la respuesta obtenida
  if (result.statusCode === 200) {
    const totalPages = []
    let link

    // Generar enlaces para todas las páginas disponibles
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        // Construir el enlace para la página actual
        link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${index}`
      } else {
        // Modificar la URL para la página actual si existe una página en la consulta
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
        link = `http://${req.hostname}:${PORT}${modifiedUrl}`
      }
      totalPages.push({ page: index, link }) // Agregar el enlace a la lista de páginas
    }
    console.log(totalPages) // Mostrar los enlaces generados en la consola

    // Renderizar la vista 'home' con la información de paginación y productos
    res.render('home', {
      title: 'CoderShop | Products',
      style: 'products.css',
      products: result.response.payload, // Lista de productos obtenidos
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages // Enlaces de todas las páginas disponibles
      }
    })
  } else {
    // Si el estado de la respuesta no es 200, enviar el código de estado y el mensaje de error
    res.status(result.statusCode).json(result.response)
  }
})
router.get('/realtimeproducts', async (req, res) => {
  // const products = await PM.getProducts()
  const products = await productModel.find().lean().exec()
  res.render('realTimeProducts', { title: 'CoderShop | Admin Products', style: 'products.css', products })
})

export default router
