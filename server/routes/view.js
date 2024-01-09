import { Router } from 'express'
import { productModel } from '../dao/models/product.js'
import { getProducts } from './product.js'
import { PORT } from '../app.js'
// import { ProductManager } from '../dao/fs/product-manager.js'

const router = Router()
// const PM = new ProductManager('./server/data/products.json')

router.get('/', async (req, res) => {
  // const products = await PM.getProducts()
  const result = await getProducts(req, res)
  console.log(result)
  if (result.statusCode === 200) {
    const totalPages = []
    let link
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${index}`
      } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
        link = `http://${req.hostname}:${PORT}${modifiedUrl}`
      }
      totalPages.push({ page: index, link })
    }
    console.log(totalPages)
    res.render('home', {
      title: 'CoderShop | Products',
      style: 'products.css',
      products: result.response.payload,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages
      }
    })
  } else {
    res.status(result.statusCode).json(result.response)
  }
})

router.get('/realtimeproducts', async (req, res) => {
  // const products = await PM.getProducts()
  const products = await productModel.find().lean().exec()
  res.render('realTimeProducts', { title: 'CoderShop | Admin Products', style: 'products.css', products })
})

export default router
