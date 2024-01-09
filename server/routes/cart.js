/* eslint-disable no-prototype-builtins */
/* eslint-disable eqeqeq */
import { Router } from 'express'
import { Types } from 'mongoose'
import { cartModel } from '../dao/models/cart.js'
import { productModel } from '../dao/models/product.js'
// import { CartManager } from '../dao/fs/cart-manager.js'

const router = Router()
// const CM = new CartManager('./server/data/carts.json')

export const getProductsFromCart = async (req, res) => {
  try {
    const cid = req.params.cid
    const result = await cartModel.findById(cid).populate('products.product').lean()
    if (result === null) return res.status(404).json({ status: 'error', error: `cart id: ${cid} not found.` })
    return {
      statusCode: 200,
      response: {
        status: 'success',
        payload: result
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      response: { error: err.message }
    }
  }
}

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
router.delete('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res) => {
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

router.put('/:cid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartModel.findById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const products = req.body.products
    if (!products) return res.status(400).json({ status: 'error', error: 'Field products is not optional.' })
    // verificar cada producto para actualizar
    for (const product of products) {
      if (!product.hasOwnProperty('product') || !product.hasOwnProperty('quantity')) {
        return res.status(400).json({ status: 'error', error: 'product must have a valid id and valid quantity.' })
      }
      if (typeof product.quantity !== 'number') {
        return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number.' })
      }
      if (product.quantity === 0) {
        return res.status(400).json({ status: 'error', error: 'product\'s quantity can not be zero (0).' })
      }
      const productToAdd = await productModel.findById(product.product)
      if (productToAdd === null) return res.status(404).json({ status: 'error', error: `Product id: ${product.product} does exists, we can not add to cart.` })
    }
    cart.products = products
    const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' })
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// Modificar la cantidad del producto en un carrito
router.put('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await cartModel.findById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const quantityToUpdate = req.body.quantity
    if (!quantityToUpdate) {
      return res.status(400).json({ status: 'error', error: 'Field quantity is not optional.' })
    }
    if (typeof quantityToUpdate !== 'number') {
      return res.status(400).json({ status: 'error', error: 'quantity must be a number.' })
    }
    if (quantityToUpdate === 0) {
      return res.status(400).json({ status: 'error', error: 'quantity can not be zero (0).' })
    }
    const productIndex = cart.products.findIndex(el => el.product == pid)
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantityToUpdate
    } else {
      return res.status(404).json({ status: 'error', error: `Product id: ${pid} does exists.` })
    }
    const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' })
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// eliminar todos los productos del carrito
router.delete('/:cid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartModel.findById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    cart.products = []
    const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' })
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

export default router
