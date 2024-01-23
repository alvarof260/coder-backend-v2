import { Types } from 'mongoose'
import { CartServices, ProductServices } from '../repositories/index.js'
import { generateCode } from '../utils.js'
import logger from '../winston.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'

export const createCartController = async (_, res) => {
  try {
    // Intenta crear un carrito
    const cart = await CartServices.create()
    // Si se crea con éxito, devuelve una respuesta con el carrito
    res.status(201).json({ status: 'success', payload: cart })
  } catch (err) {
    // Si hay un error, crea un error personalizado con detalles sobre el error
    const error = CustomError.createError({
      name: 'Error creating cart.',
      cause: err.message,
      message:
        'Error creating cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    // Registra la causa del error
    logger.error(error.cause)
    // Devuelve una respuesta con el mensaje de error
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const getByIdCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to fetch a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }
    res.status(200).json({ status: 'success', payload: cart })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error fetching cart.',
      cause: err.message,
      message:
        'Error fetching cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
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

    if (!exists) {
      const error = CustomError.createError({
        name: 'Error product does not exists.',
        cause: 'User tried to add a product that does not exists.',
        message: `Product id: ${pid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }

    const cartToAdd = await CartServices.getById(cid)
    if (cartToAdd === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to add a product to a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }

    const prodIndex = cartToAdd.products.findIndex(
      (el) => el.product.toString() === pid
    )

    prodIndex > -1
      ? (cartToAdd.products[prodIndex].quantity += 1)
      : cartToAdd.products.push({
        product: new Types.ObjectId(pid),
        quantity: 1
      })
    const cartUpdated = await CartServices.update(cid, cartToAdd)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error updating cart.',
      cause: err.message,
      message:
        'Error updating cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
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
    if (productToDelete === null) {
      const error = CustomError.createError({
        name: 'Error fetching product.',
        cause: 'User tried to delete a product that does not exists.',
        message: `Product id: ${pid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }
    const cart = await CartServices.getById(cid)
    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause:
          'User tried to delete a product from a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }
    const prodIndex = cart.products.findIndex(
      (el) => el.product.toString() === pid
    )

    if (prodIndex > -1) {
      // eliminar el producto que se desea borrar
      cart.products = cart.products.filter(
        (el) => el.product.toString() !== pid
      )
    } else {
      const error = CustomError.createError({
        name: 'Error fetching product.',
        cause:
          'The user tried to delete a product that does not exist in the cart.',
        message: `Product id: ${pid} not found in cart.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }

    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error updating cart.',
      cause: err.message,
      message:
        'Error updating cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const updateCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to update a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }
    const products = req.body.products
    if (!products) {
      const error = CustomError.createError({
        name: 'Error updating cart.',
        cause: 'User tried to update a cart without products.',
        message: 'Field products is not optional.',
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res
        .status(400)
        .json({ status: 'error', error: error.message })
    }
    // verificar cada producto para actualizar
    for (const product of products) {
      if (
        !Object.prototype.hasOwnProperty.call(product, 'product') ||
        !Object.prototype.hasOwnProperty.call(product, 'quantity')
      ) {
        const error = CustomError.createError({
          name: 'Error updating cart.',
          cause: 'User tried to update a cart with invalid products.',
          message: 'product must have a valid id and valid quantity.',
          code: EErrors.INVALID_DATA_ERROR
        })
        logger.warn(error.cause)
        return res.status(400).json({
          status: 'error',
          error: error.message
        })
      }
      if (typeof product.quantity !== 'number') {
        const error = CustomError.createError({
          name: 'Error updating cart.',
          cause: 'User tried to update a cart with invalid products.',
          message: 'product quantity must be a number.',
          code: EErrors.INVALID_TYPES_ERROR
        })
        logger.warn(error.cause)
        return res.status(400).json({
          status: 'error',
          error: error.message
        })
      }
      if (product.quantity === 0) {
        const error = CustomError.createError({
          name: 'Error updating cart.',
          cause: 'User tried to update a cart with invalid products.',
          message: 'product quantity can not be zero (0).',
          code: EErrors.INVALID_DATA_ERROR
        })
        logger.warn(error.cause)
        return res.status(400).json({
          status: 'error',
          error: error.message
        })
      }
      const productToAdd = await ProductServices.getById(product.product)
      if (productToAdd === null) {
        const error = CustomError.createError({
          name: 'Error updating cart.',
          cause: 'User tried to update a cart with invalid products.',
          message: `Product id: ${product.product} not found, You cannot add products that do not exist to the cart.`,
          code: EErrors.INVALID_DATA_ERROR
        })
        console.log(error.cause)
        return res.status(404).json({
          status: 'error',
          error: error.message
        })
      }
    }
    cart.products = products
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error updating cart.',
      cause: err.message,
      message:
        'Error updating cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const updateQuantityProductController = async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid

    const cart = await CartServices.getById(cid)
    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to update a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.warn(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }
    const quantityToUpdate = req.body.quantity
    if (!quantityToUpdate) {
      const error = CustomError.createError({
        name: 'Error updating the quantity of product in the cart.',
        cause: 'User tried to update a cart without quantity.',
        message: 'Field quantity is not optional.',
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res
        .status(400)
        .json({ status: 'error', error: error.message })
    }
    if (typeof quantityToUpdate !== 'number') {
      const error = CustomError.createError({
        name: 'Error updating the quantity of product in the cart.',
        cause: 'User tried to update a cart with invalid quantity.',
        message: 'quantity must be a number.',
        code: EErrors.INVALID_TYPES_ERROR
      })
      logger.error(error.cause)
      return res
        .status(400)
        .json({ status: 'error', error: error.message })
    }
    if (quantityToUpdate === 0) {
      const error = CustomError.createError({
        name: 'Error updating the quantity of product in the cart.',
        cause: 'User tried to update a cart with invalid quantity.',
        message: 'quantity can not be zero (0).',
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res
        .status(400)
        .json({ status: 'error', error: error.message })
    }
    const productIndex = cart.products.findIndex(
      (el) => el.product.toString() === pid
    )
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantityToUpdate
    } else {
      const error = CustomError.createError({
        name: 'Error updating the quantity of product in the cart.',
        cause: 'User tried to update a cart with invalid quantity.',
        message: `Product id: ${pid} not found in cart.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error updating the quantity of product in the cart.',
      cause: err.message,
      message:
        'Error updating the quantity of product in the cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.fatal(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const deleteCartController = async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await CartServices.getById(cid)
    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to delete a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }
    cart.products = []
    const cartUpdated = await CartServices.update(cid, cart)
    res.status(200).json({ status: 'success', payload: cartUpdated })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Error deleting cart.',
      cause: err.message,
      message:
        'Error deleting cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const purchasedCartController = async (req, res) => {
  try {
    const cid = req.params.cid

    const cart = await CartServices.getById(cid)

    if (cart === null) {
      const error = CustomError.createError({
        name: 'Error fetching cart.',
        cause: 'User tried to purchase a cart that does not exists.',
        message: `Cart id: ${cid} not found.`,
        code: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res
        .status(404)
        .json({ status: 'error', error: error.message })
    }

    let total = 0
    const outOfStockProducts = []
    for (let index = 0; index < cart.products.length; index++) {
      logger.warn(cart.products[index])
      const product = await ProductServices.getById(
        cart.products[index].product
      )
      if (product === null) {
        const error = CustomError.createError({
          name: 'Error fetching product.',
          cause: 'User tried to purchase a product that does not exists.',
          message: `Product id: ${cart.products[index].product} not found.`,
          code: EErrors.INVALID_DATA_ERROR
        })
        logger.error(error.cause)
        return res.status(404).json({
          status: 'error',
          error: error.message
        })
      }
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
    const error = CustomError.createError({
      name: 'Error purchasing cart.',
      cause: err.message,
      message:
        'Error purchasing cart [Internal Error 500], Please try again later.',
      code: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: err.message })
  }
}
