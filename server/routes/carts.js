import { Router } from 'express'
// import { CartManager } from '../dao/fs/cart-manager.js'

const router = Router()
// const CM = new CartManager('./server/data/carts.json')

// crear el carrito
router.post('/', async (req, res) => {
/*   try {
    const cartCreated = await CM.createCart()
    return res.status(201).json({ status: 'sucess', payload: cartCreated })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error creating cart.' })
  } */
})

// Obtener el carrito por su ID
router.get('/:cid((\\d+))', async (req, res) => {
/*   try {
    const cid = parseInt(req.params.cid)
    const cart = await CM.getProductsFromCart(cid)
    if (!cart) return res.status(404).json({ status: 'error', error: `Cart not found by id: ${cid}.` })
    return res.status(200).json({ status: 'sucess', payload: cart })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching carts.' })
  } */
})

// Actualizar los productos que estan en el carrito
router.put('/:cid((\\d+))/product/:pid((\\d+))', async (req, res) => {
/*   try {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const cartUpdated = await CM.addProductFromCart(cid, pid)
    if (!cartUpdated) return res.status(404).json({ status: 'error', error: `Cart not found by id: ${cid}.` })
    return res.status(200).json({ status: 'sucess', payload: cartUpdated })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching carts.' })
  } */
})

export default router
