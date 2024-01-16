import { Router } from 'express'

import { productModel } from '../dao/models/product.js'
import { getProducts } from '../controllers/product.js'
import config from '../config/config.js'
import { getProductsFromCart } from '../controllers/cart.js'
import { verifyToken } from '../utils.js'

// import { ProductManager } from '../dao/fs/product-manager.js'

const router = Router()
// const PM = new ProductManager('./server/data/products.json')

router.get('/', async (req, res) => {
  const decoded = verifyToken(req.signedCookies[config.strategy.cookieName])
  // Llamada a la función getProducts para obtener los datos
  const result = await getProducts(req, res)

  // Verificar el estado de la respuesta obtenida
  if (result.statusCode === 200) {
    const totalPages = []
    let link

    // Generar enlaces para todas las páginas disponibles
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        // Construir el enlace para la página actual
        link = `http://${req.hostname}:${config.config.port}${req.originalUrl}&page=${index}`
      } else {
        // Modificar la URL para la página actual si existe una página en la consulta
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
        link = `http://${req.hostname}:${config.config.port}${modifiedUrl}`
      }
      totalPages.push({ page: index, link }) // Agregar el enlace a la lista de páginas
    }

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
      },
      // user: req.session.user
      user: decoded.user
    })
  } else {
    // Si el estado de la respuesta no es 200, enviar el código de estado y el mensaje de error
    res.status(result.statusCode).json(result.response)
  }
})

// manejos de productos que estan a la ventas
router.get('/realtimeproducts', async (req, res) => {
  // const products = await PM.getProducts()
  const products = await productModel.find().lean().exec()
  res.render('realTimeProducts', { title: 'CoderShop | Admin Products', style: 'products.css', products })
})

// ver el carrito que a cada uno le pertenece
router.get('/:cid([a-fA-F0-9]{24})', async (req, res) => {
  const result = await getProductsFromCart(req, res)
  console.log(result)
  if (result.statusCode === 200) {
    res.render('cart', { title: 'CoderShop | My Cart', style: 'products.css', cart: result.response.payload })
  } else {
    res.status(result.statusCode).json(result.response)
  }
})

export default router
