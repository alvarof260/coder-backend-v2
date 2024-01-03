import { Router } from 'express'
import { ProductManager } from '../fs/product-manager.js'

const router = Router()
const PM = new ProductManager('./src/data/products.json')

router.get('/', async (req, res) => {
  const products = await PM.getProduct()
  res.render('home', { title: 'CoderShop | Products', style: 'products.css', products })
})

export default router
