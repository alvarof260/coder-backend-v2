import { Router } from 'express'
import { productsModel } from '../dao/models/products.js'
/* import { ProductManager } from '../dao/fs/product-manager.js'
import { verifyProduct, verifyProductPartial } from '../utils.js' */

// Inicializar recursos importantes para el trabajo del CRUD
// const PM = new ProductManager('./server/data/products.json')
const router = Router()

// Obtener todos los productos o limitar la lista de productos
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query // Obtiene el parámetro limit
    const parsedLimit = parseInt(limit)
    if (!parsedLimit || isNaN(parsedLimit)) {
      const products = await productsModel.find()
      return res.status(200).json({ status: 'success', payload: products })
    }
    const products = await productsModel.find().limit(parsedLimit)
    res.status(200).json({ status: 'success', payload: products })
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
router.get('/:pid((\\d+))', async (req, res) => {
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
    const productAdd = await productsModel.create(product)
    res.status(201).json({ status: 'sucess', payload: productAdd })
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
router.put('/:pid((\\d+))', async (req, res) => {
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
router.delete('/:pid((\\d+))', async (req, res) => {
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
