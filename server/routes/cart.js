/* eslint-disable eqeqeq */
import { Router } from 'express'
import { Types } from 'mongoose'
import { cartModel } from '../dao/models/cart.js'
import { productModel } from '../dao/models/product.js'
// import { CartManager } from '../dao/fs/cart-manager.js'

const router = Router()
// const CM = new CartManager('./server/data/carts.json')

// crear el carrito
router.post('/', async (req, res) => {
  try {
    const cart = await cartModel.create({})
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
    const cart = await cartModel.findById(cid)
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
    const exists = await productModel.exists({ _id: pid })
    if (!exists) return res.status(404).json({ status: 'error', error: `Product id: ${pid} not found.` })
    const cartToAdd = await cartModel.findById(cid)
    if (cartToAdd === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const prodIndex = cartToAdd.products.findIndex(el => el.product == pid)
    console.log(prodIndex)
    console.log(cartToAdd.products)
    prodIndex > -1 ? cartToAdd.products[prodIndex].quantity += 1 : cartToAdd.products.push({ product: new Types.ObjectId(pid), quantity: 1 })
    const cartUpdated = await cartModel.findByIdAndUpdate(cid, cartToAdd, { returnDocument: 'after' })
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

// borrar un producto de un carrito
router.delete('/:cid([a-fA-F0-9]{24})/product/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const productToDelete = await productModel.findById(pid)
    if (productToDelete === null) return res.status(404).json({ status: 'error', error: `Product id: ${pid} not found.` })
    const cart = await cartModel.findById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const prodIndex = cart.products.findIndex(el => el.product == pid)

    if (prodIndex > -1) {
      // eliminar el producto que se desea borrar
      cart.products = cart.products.filter(el => el.product.toString() !== pid)
    } else {
      return res.status(404).json({ status: 'error', error: 'Product not found in cart.' })
    }

    const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' })
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

export default router