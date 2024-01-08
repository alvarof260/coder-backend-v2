/* eslint-disable eqeqeq */
import { Router } from 'express'
import { Types } from 'mongoose'
import { cartsModel } from '../dao/models/cart.js'
import { productsModel } from '../dao/models/product.js'
// import { CartManager } from '../dao/fs/cart-manager.js'

const router = Router()
// const CM = new CartManager('./server/data/carts.json')

// crear el carrito
router.post('/', async (req, res) => {
  try {
    const cart = await cartsModel.create({})
    res.status(201).json({ status: 'success', payload: cart })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
/*   try {
    const cartCreated = await CM.createCart()
    return res.status(201).json({ status: 'sucess', payload: cartCreated })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error creating cart.' })
  } */
})

// Obtener el carrito por su ID
router.get('/:cid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartsModel.findById(cid)
    res.status(200).json({ status: 'success', payload: cart })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
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
router.put('/:cid([a-fA-F0-9]{24})/product/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const exists = await productsModel.exists({ _id: pid })
    if (!exists) return res.status(404).json({ status: 'error', error: 'Product not found.' })
    const cartToAdd = await cartsModel.findById(cid)
    if (cartToAdd === null) return res.status(404).json({ status: 'error', error: 'Cart not found.' })
    const prodIndex = cartToAdd.products.findIndex(el => el.product == pid)
    console.log(prodIndex)
    console.log(cartToAdd.products)
    prodIndex > -1 ? cartToAdd.products[prodIndex].quantity += 1 : cartToAdd.products.push({ product: new Types.ObjectId(pid), quantity: 1 })
    const cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartToAdd, { returnDocument: 'after' })
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
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
