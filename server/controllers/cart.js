import { Types } from 'mongoose'
import {
  CartServices,
  ProductServices
} from '../repositories/index.js'
import { generateCode } from '../utils.js'

export const createCartController = async (req, res) => {
  try {
    const cart = await CartServices.create()
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
}

export const getByIdCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
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
}

export const updateProductFromCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const exists = await ProductServices.getById(pid)
    if (!exists) return res.status(404).json({ status: 'error', error: `Product id: ${pid} not found.` })
    const cartToAdd = await CartServices.getById(cid)
    if (cartToAdd === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const prodIndex = cartToAdd.products.findIndex(el => el.product.toString() === pid)
    prodIndex > -1 ? cartToAdd.products[prodIndex].quantity += 1 : cartToAdd.products.push({ product: new Types.ObjectId(pid), quantity: 1 })
    const cartUpdated = await CartServices.update(cid, cartToAdd)
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
}

export const deleteProductFromCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const productToDelete = await ProductServices.getById(pid)
    if (productToDelete === null) return res.status(404).json({ status: 'error', error: `Product id: ${pid} not found.` })
    const cart = await CartServices.getById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const prodIndex = cart.products.findIndex(el => el.product.toString() === pid)

    if (prodIndex > -1) {
      // eliminar el producto que se desea borrar
      cart.products = cart.products.filter(el => el.product.toString() !== pid)
    } else {
      return res.status(404).json({ status: 'error', error: 'Product not found in cart.' })
    }

    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const updateCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    const products = req.body.products
    if (!products) return res.status(400).json({ status: 'error', error: 'Field products is not optional.' })
    // verificar cada producto para actualizar
    for (const product of products) {
      if (!Object.prototype.hasOwnProperty.call(product, 'product') || !Object.prototype.hasOwnProperty.call(product, 'quantity')) {
        return res.status(400).json({ status: 'error', error: 'product must have a valid id and valid quantity.' })
      }
      if (typeof product.quantity !== 'number') {
        return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number.' })
      }
      if (product.quantity === 0) {
        return res.status(400).json({ status: 'error', error: 'product\'s quantity can not be zero (0).' })
      }
      const productToAdd = await ProductServices.getById(product.product)
      if (productToAdd === null) return res.status(404).json({ status: 'error', error: `Product id: ${product.product} does exists, we can not add to cart.` })
    }
    cart.products = products
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const updateQuantityProductController = async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await CartServices.getById(cid)
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
    const productIndex = cart.products.findIndex(el => el.product.toString() === pid)
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantityToUpdate
    } else {
      return res.status(404).json({ status: 'error', error: `Product id: ${pid} does exists.` })
    }
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const deleteCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })
    cart.products = []
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}
export const purchasedCartController = async (req, res) => {
  try {
    const cid = req.params.cid

    const cart = await CartServices.getById(cid)

    if (cart === null) return res.status(404).json({ status: 'error', error: `Cart id: ${cid} not found.` })

    let total = 0
    const outOfStockProducts = []
    for (let index = 0; index < cart.products.length; index++) {
      console.log(cart.products[index])
      const product = await ProductServices.getById(cart.products[index].product)
      if (product === null) return res.status(404).json({ status: 'error', error: `Product id: ${cart.products[index].product} not found.` })
      if (cart.products[index].quantity > product.stock) {
        outOfStockProducts.push(cart.products[index])
        continue
      }
      product.stock -= cart.products[index].quantity
      total += product.price * cart.products[index].quantity
      await ProductServices.update(product._id, product)
    }

    // Actualizar el carrito para eliminar los productos que se han comprado y agregar los productos que están fuera de stock
    cart.products = outOfStockProducts
    await CartServices.update(cart._id, cart)

    const ticket = await CartServices.createTicket({
      code: generateCode(),
      amount: total,
      purcharser: req.user.email
    })

    res.status(201).json({ status: 'success', payload: ticket })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}
