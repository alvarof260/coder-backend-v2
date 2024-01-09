import { Router } from 'express'
import { productModel } from '../dao/models/product.js'
// import { ProductManager } from '../dao/fs/product-manager.js'

const router = Router()
// const PM = new ProductManager('./server/data/products.json')

router.get('/', async (req, res) => {
  // const products = await PM.getProducts()
  const products = await productModel.find().lean().exec()
  res.render('home', { title: 'CoderShop | Products', style: 'products.css', products })
})

router.get('/realtimeproducts', async (req, res) => {
  // const products = await PM.getProducts()
  const products = await productModel.find().lean().exec()
  res.render('realTimeProducts', { title: 'CoderShop | Admin Products', style: 'products.css', products })
})

export default router