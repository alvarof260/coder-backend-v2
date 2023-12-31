import { Router } from 'express'
import { ProductManager } from '../fs/product-manager.js'
import { verifyProduct, verifyProductPartial } from '../utils.js'

const PM = new ProductManager('./src/data/products.json') // inicializo la clase de Product Manager.
const router = Router() // inicio el router

router.get('/', async (req, res) => {
  try { // intentar ejecutar la funcion
    const response = await PM.getProduct() // obtener los productos
    const { limit } = req.query // obtener si es que se puso un limite
    if (!limit) return res.status(200).json({ status: 'sucess', payload: response }) // si no tiene un limite te devuelve todo el array de productos
    const limitValue = parseInt(limit) // paso el valor de string a int. porque al pasar el valor del limit por query se lo obtiene con valor string
    if (!isNaN(limitValue) && limitValue > 0) { // verifico si el valor es un numero y si es es mayor a 0
      const productsLimited = response.slice(0, limitValue) // limito el array segun el numero de productos que desea ver el usuario
      return res.status(200).json({ status: 'sucess', payload: productsLimited }) // devuelvo el array
    } else {
      return res.status(500).json({ status: 'error', error: 'Invalid limit parameter.' }) // si no es un numero el limitValue se devuelve un error de valor invalido
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching products.' }) // error si no se puede obtener los productos
  }
})

router.get('/:pid((\\d+))', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid) // convierto en numero entero al parametro del id
    const product = await PM.getProductByID(pid) // busco el producto
    if (!product) return res.status(404).json({ status: 'error', error: `Product not found by id: ${pid}.` }) // si no existe devuelvo error
    return res.status(200).json({ status: 'sucess', payload: product }) // mostrar el producto filtrado
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error fetching product.' }) // error si no se puede obtener el producto
  }
})

router.post('/', async (req, res) => {
  try {
    const product = req.body // recibe el producto desde el body
    const verification = verifyProduct(product) // verifico errores de los valores ingresados
    if (verification) return res.status(400).json({ status: 'error', error: verification }) // si tiene errores retorno los campos que tienen errores
    const productAdd = await PM.addProduct(product) // si no tiene errores se agrega el producto
    if (!productAdd) return res.status(500).json({ status: 'error', error: 'Missing unfilled fields.' }) // si el producto le falta campos a completar retorna el error de campos sin completar
    res.status(201).json({ status: 'sucess', payload: productAdd }) // si pasa todo las verificaciones se agrega el producto y retornamos el producto agregado
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error adding product.' }) // error si no se puede agregar el producto
  }
})

router.put('/:pid((\\d+))', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid) // convierto en numero entero al parametro del id
    const data = req.body // recibe los datos que quiere actualizar desde el body
    const verification = verifyProductPartial(data) // verifica que los datos que se quiere actualizar cumpla con los tipos de datos
    if (verification) return res.status(400).json({ status: 'error', error: verification }) // si tiene errores retorno los campos que tienen errores
    const productUpdated = await PM.updateProduct(pid, data) // actualizo el producto
    if (!productUpdated) return res.status(404).json({ status: 'error', error: `Product not found by id: ${pid}.` }) // si no existe el producto con el id que paso retorna el error de que no existe el producto
    return res.status(200).json({ status: 'sucess', payload: productUpdated }) // retorna el producto actualizado
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error updating product.' }) // error si no se puede agregar el producto
  }
})

router.delete('/:pid((\\d+))', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid) // convierto en numero entero al parametro del id
    const productDeleted = await PM.deleteProduct(pid)
    if (!productDeleted) return res.status(404).json({ status: 'sucess', error: `Product not found by id: ${pid}.` }) // si no existe el producto con el id que paso retorna el error de que no existe el producto
    return res.status(200).json({ status: 'sucess', payload: productDeleted }) // retorna el producto borrado
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error deleting product.' }) // error si no se puede agregar el producto
  }
})

export default router
