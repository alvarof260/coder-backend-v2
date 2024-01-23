import { ProductServices } from '../repositories/index.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { generateProductInfoError } from '../services/errors/info.js'
import { generateProducts } from '../utils.js'
import logger from '../winston.js'

/* export const getProducts = async (req, res) => {
  try {
    // Configuración de paginación predeterminada (limit y page)
    const limit = req.query.limit || 10 // Obtener el límite de productos por página
    const page = req.query.page || 1 // Obtener la página actual
    const paginateOptions = { lean: true, limit, page } // Opciones de paginación

    // Configuración de opciones de consulta (filtros)
    const queryOptions = {}
    if (req.query.stock) queryOptions.stock = req.query.stock // Filtrar por stock
    if (req.query.price) queryOptions.price = req.query.price // Filtrar por precio
    if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 } // Orden ascendente por precio
    if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 } // Orden descendente por precio

    // Obtener los productos paginados de acuerdo a las opciones de paginación y consulta
    const result = await productModel.paginate(queryOptions, paginateOptions)

    // Construir enlaces para la paginación (previo y siguiente)
    let prevLink
    if (!req.query.page) {
      prevLink = `http://${req.hostname}:${config.config.port}${req.originalUrl}&page=${result.prevPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.prevPage}`)
      prevLink = `http://${req.hostname}:${config.config.port}${modifiedUrl}`
    }

    let nextLink
    if (!req.query.page) {
      nextLink = `http://${req.hostname}:${config.config.port}${req.originalUrl}&page=${result.nextPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.nextPage}`)
      nextLink = `http://${req.hostname}:${config.config.port}${modifiedUrl}`
    }

    // Devolver la respuesta con los datos de paginación y los productos obtenidos
    return {
      statusCode: 200,
      response: {
        status: 'success',
        payload: result.docs, // Lista de productos obtenidos
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? prevLink : null,
        nextLink: result.hasNextPage ? nextLink : null
      }
    }
  } catch (err) {
    // Manejo de errores en caso de que falle la obtención de productos
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message } // Devolver un mensaje de error
    }
  }
} */

export const getProductsController = async (req, res) => {
  try {
    const result = await ProductServices.getAllPaginates(req, res)
    res.send(result.statusCode).json(result.response)
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error fetching products [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
  /*  try {
      const response = await PM.getProducts()
      const { limit } = req.query
      if (!limit) return res.status(200).json({ status: 'sucess', payload: response })
      const limitValue = parseInt(limit)
      if (!isNaN(limitValue) && limitValue > 0) {
        const productsLimited = response.slice(0, limitValue) // limito el array segun el numero de productos que desea ver el usuario
        return res.status(200).json({ status: 'sucess', payload: productsLimited })
      } else {
        return res.status(500).json({ status: 'error', error: 'Invalid limit parameter.' })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error fetching products.' })
    } */
}

export const getProductByIdController = async (req, res) => {
  try {
    const pid = req.params.pid
    const product = await ProductServices.getById(pid)
    if (product == null) {
      const error = CustomError.createError({
        name: 'Product not found',
        cause: 'User tried to get a product that does not exist.',
        message: `Product not found by id: ${pid}.`,
        error: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }
    res.status(200).json({ status: 'success', payload: product })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error fetching product [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
  /* try {
      const pid = parseInt(req.params.pid)
      const product = await PM.getProductByID(pid)
      if (!product) return res.status(404).json({ status: 'error', error: `Product not found by id: ${pid}.` })
      return res.status(200).json({ status: 'sucess', payload: product })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error fetching product.' })
    } */
}

export const createProductController = async (req, res) => {
  try {
    const product = req.body
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock ||
      !product.status ||
      !product.category
    ) {
      const error = CustomError.createError({
        name: 'Missing fields',
        cause: generateProductInfoError(product),
        message: 'Missing unfilled fields, try again.',
        error: EErrors.INVALID_TYPES_ERROR
      })
      logger.error(error.cause)
      return res.status(400).json({ status: 'error', error: error.message })
    }
    const productAdd = await ProductServices.create(product)
    res.status(201).json({ status: 'success', payload: productAdd })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error adding product [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
  /*  try {
      const product = req.body
      const verification = verifyProduct(product)
      if (verification) return res.status(400).json({ status: 'error', error: verification })
      const productAdd = await PM.addProduct(product)
      if (!productAdd) return res.status(500).json({ status: 'error', error: 'Missing unfilled fields.' })
      res.status(201).json({ status: 'sucess', payload: productAdd })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error adding product.' })
    } */
}

export const updateProductController = async (req, res) => {
  try {
    const pid = req.params.pid
    const data = req.body
    const productUpdated = await ProductServices.update(pid, data)
    if (productUpdated) {
      // Si productUpdated existe, significa que se actualizó correctamente
      return res
        .status(200)
        .json({ status: 'success', payload: productUpdated })
    } else {
      // Si productUpdated es null, significa que no se encontró el producto para actualizar
      const error = CustomError.createError({
        name: 'Product not found',
        cause: 'User tried to update a product that does not exist.',
        message: `Product not found by id: ${pid}.`,
        error: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error updating product [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
  /*  try {
      const pid = parseInt(req.params.pid)
      const data = req.body
      const verification = verifyProductPartial(data)
      if (verification) return res.status(400).json({ status: 'error', error: verification })
      const productUpdated = await PM.updateProduct(pid, data)
      if (!productUpdated) return res.status(404).json({ status: 'error', error: `Product not found by id: ${pid}.` })
      return res.status(200).json({ status: 'sucess', payload: productUpdated })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error updating product.' })
    } */
}

export const deleteProductController = async (req, res) => {
  try {
    const pid = req.params.pid
    const productDeleted = await ProductServices.delete(pid)
    if (productDeleted) {
      // Si productDeleted existe, significa que se eliminó correctamente
      return res
        .status(200)
        .json({ status: 'success', payload: productDeleted })
    } else {
      // Si productDeleted es null, significa que no se encontró el producto para eliminar
      const error = CustomError.createError({
        name: 'Product not found',
        cause: 'User tried to delete a product that does not exist.',
        message: `Product not found by id: ${pid}.`,
        error: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res.status(404).json({ status: 'error', error: error.message })
    }
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error deleting product [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: error.message })
  }
  /* try {
      const pid = parseInt(req.params.pid)
      const productDeleted = await PM.deleteProduct(pid)
      if (!productDeleted) return res.status(404).json({ status: 'sucess', error: `Product not found by id: ${pid}.` })
      return res.status(200).json({ status: 'sucess', payload: productDeleted })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error deleting product.' })
    } */
}

export const mockProductsController = async (req, res) => {
  try {
    const mockProducts = generateProducts()
    if (!mockProducts) {
      const error = CustomError.createError({
        name: 'Error generating products',
        cause: 'Error generating products.',
        message: 'Error generating products.',
        error: EErrors.INVALID_DATA_ERROR
      })
      logger.error(error.cause)
      return res.status(500).json({ status: 'error', error: error.message })
    }
    const products = await ProductServices.createMany(mockProducts)
    res.status(201).json({ status: 'success', payload: products })
  } catch (err) {
    const error = CustomError.createError({
      name: 'Database error',
      cause: err.message,
      message:
        'Error adding mockproducts [Internal Error 500], Please try again later.',
      error: EErrors.DATABASE_ERROR
    })
    logger.error(error.cause)
    res.status(500).json({ status: 'error', error: err.message })
  }
}
