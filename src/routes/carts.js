import { Router } from 'express'
import { CartManager } from '../fs/cart-manager.js'

const router = Router()
const CM = new CartManager('./src/data/carts.json')

router.post('/', async (req, res) => {
  try {
    const cartCreated = await CM.createCart()
    return res.status(201).json({ status: 'sucess', payload: cartCreated })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error creating cart.' })
  }
})

router.get('/:cid((\\d+))', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    const cart = await CM.getProductsFromCart(cid)
    if (!cart) return res.status(404).json({ status: 'error', error: `Cart not found by id: ${cid}.` })
    return res.status(200).json({ status: 'sucess', payload: cart })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching carts.' })
  }
})

router.put('/:cid((\\d+))/product/:pid((\\d+))', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const cartUpdated = await CM.addProductFromCart(cid, pid)
    if (!cartUpdated) return res.status(404).json({ status: 'error', error: `Cart not found by id: ${cid}.` })
    return res.status(200).json({ status: 'sucess', payload: cartUpdated })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching carts.' })
  }
})

export default router
