import { Router } from 'express'
import { ProductManager } from '../fs/product-manager.js'

const router = Router()
const PM = new ProductManager('./server/data/products.json')

router.get('/', async (req, res) => {
  const products = await PM.getProducts()
  res.render('home', { title: 'CoderShop | Products', style: 'products.css', products })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await PM.getProducts()
  res.render('realTimeProducts', { title: 'CoderShop | Admin Products', style: 'products.css', products })
})

export default router
