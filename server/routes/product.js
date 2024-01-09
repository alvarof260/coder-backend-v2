import { Router } from 'express'
import { productModel } from '../dao/models/product.js'
import { PORT } from '../app.js'
/* import { ProductManager } from '../dao/fs/product-manager.js'
import { verifyProduct, verifyProductPartial } from '../utils.js' */

// Inicializar recursos importantes para el trabajo del CRUD
// const PM = new ProductManager('./server/data/products.json')
const router = Router()

// obtener los productos y los datos para la paginacion
export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const paginateOptions = { lean: true, limit, page }
    const queryOptions = {}
    if (req.query.stock) queryOptions.stock = req.query.stock
    if (req.query.price) queryOptions.price = req.query.price
    if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
    if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }
    const result = await productModel.paginate(queryOptions, paginateOptions)
    let prevLink
    if (!req.query.page) {
      prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.prevPage}`)
      prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
    }
    let nextLink
    if (!req.query.page) {
      nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.nextPage}`)
      nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
    }
    return {
      statusCode: 200,
      response: {
        status: 'success',
        payload: result.docs,
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
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message }
    }
  }
}

// Obtener todos los productos o limitar la lista de productos
router.get('/', async (req, res) => {
  try {
    const result = await getProducts(req, res)
    res.send(result.statusCode).json(result.response)
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
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
})

// Obtener un producto por su id
router.get('/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const pid = req.params.pid
    const product = await productModel.findById(pid)
    res.status(200).json({ status: 'success', payload: product })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
  /* try {
    const pid = parseInt(req.params.pid)
    const product = await PM.getProductByID(pid)
    if (!product) return res.status(404).json({ status: 'error', error: `Product not found by id: ${pid}.` })
    return res.status(200).json({ status: 'sucess', payload: product })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching product.' })
  } */
})

// Agregar un producto a la base de datos
router.post('/', async (req, res) => {
  try {
    const product = req.body
    const productAdd = await productModel.create(product)
    res.status(201).json({ status: 'success', payload: productAdd })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
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
})

// Obtener un producto por su id y actualizar datos
router.put('/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const pid = req.params.pid
    const data = req.body
    const productUpdated = await productModel.findOneAndUpdate({ _id: pid }, data, { returnDocument: 'after' })
    if (productUpdated) {
      // Si productUpdated existe, significa que se actualizó correctamente
      return res.status(200).json({ status: 'success', payload: productUpdated })
    } else {
      // Si productUpdated es null, significa que no se encontró el producto para actualizar
      return res.status(404).json({ status: 'error', error: 'Product not found or not updated' })
    }
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
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
})

// Eliminar un producto de la base de datos
router.delete('/:pid([a-fA-F0-9]{24})', async (req, res) => {
  try {
    const pid = req.params.pid
    const productDeleted = await productModel.findByIdAndDelete({ _id: pid }, { returnDocument: 'after' })
    if (productDeleted) {
      // Si productDeleted existe, significa que se eliminó correctamente
      return res.status(200).json({ status: 'success', payload: productDeleted })
    } else {
      // Si productDeleted es null, significa que no se encontró el producto para eliminar
      return res.status(404).json({ status: 'error', error: 'Product not found or not deleted' })
    }
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
  /* try {
    const pid = parseInt(req.params.pid)
    const productDeleted = await PM.deleteProduct(pid)
    if (!productDeleted) return res.status(404).json({ status: 'sucess', error: `Product not found by id: ${pid}.` })
    return res.status(200).json({ status: 'sucess', payload: productDeleted })
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error deleting product.' })
  } */
})

export default router
