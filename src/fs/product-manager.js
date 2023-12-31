import { readFile, writeFile } from 'node:fs/promises'
import { existsSync, stat } from 'node:fs'

export class ProductManager {
  #path // ocultar la propiedad
  constructor (path) {
    this.#path = path // guardar ruta donde se guarda los productos
    this.#init() // inicializar la ruta donde se guarda los productos
  }

  #init = async () => {
    if (!existsSync(this.#path)) {
      await writeFile(this.#path, JSON.stringify([], null, '\t'))
    }
  }

  getProduct = async () => {
    try {
      const response = await readFile(this.#path, 'utf-8') // recibo los datos que tiene el archivo como json stringify
      const products = JSON.parse(response) // paso a tenerlo parseado para poder trabajar con el array
      return products
    } catch (err) {
      console.error('Error al leer el archivo: ', err) // manejo los errores
    }
  }

  getProductByID = async (id) => {
    const products = await this.getProduct()
    const product = products.find(el => el.id === id) // busco el id, si este id existe, lo guardo en una variable
    if (typeof product === 'undefined') return // no existe el id, devuelvo el error
    return product // devuelvo el producto que se pidio
  }

  addProduct = async (product) => {
    try {
      const { title, description, price, thumbnail, code, stock, status } = product // recibo los datos del producto a añadir
      const thumbnailValue = thumbnail || []
      const statusValue = status || true
      if (!title || !description || !price || !code || !stock) return // verificacion de datos, en el cual faltan datos retorna un error
      const products = await this.getProduct() // obtengo el array de producto para trabajar
      const id = this.generateID(products) // genero el id
      const productToAdd = { title, description, price, thumbnail: thumbnailValue, code, stock, status: statusValue, id } // creo el objeto del producto
      products.push(productToAdd) // agrego al array para luego pasarlo al archivo
      await this.atomicWriteFile(products)
      return productToAdd
    } catch (err) {
      console.error('Error al añadir el producto al archivo: ', err)
      throw new Error('No se pudo añadir el producto.')
    }
  }

  updateProduct = async (itemId, dataUpdate) => {
    const products = await this.getProduct() // recibo los productos
    const productsUpdated = products.map(el => { // voy por todos los objetos del array y busco cual es el id que busco luego agrego los datos actualizado, si no es el que busco deja todo igual
      if (el.id === itemId) return { ...el, ...dataUpdate }
      else return el
    })
    await this.atomicWriteFile(productsUpdated)
    const productUpdate = await this.getProductByID(itemId)
    return productUpdate
  }

  deleteProduct = async (itemId) => {
    const products = await this.getProduct()
    const productsUpdate = products.filter(el => el.id !== itemId)
    await this.atomicWriteFile(productsUpdate)
    return { sucess: true, payload: productsUpdate }
  }

  generateID = (products) => {
    return (products.length === 0) ? 1 : products[products.length - 1].id + 1
  }

  atomicWriteFile = async (products) => {
    try {
      // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
      await writeFile(this.#path, JSON.stringify(products, null, '\t'))
    } catch (err) {
      console.error('Error al escribir en el archivo: ', err)
      throw new Error('No se pudo escribir en el archivo.') // Propagar el error para un manejo superior
    }
  }
}

/* (async () => {
  const dm = new ProductManager('src/data/products.json')
  const products = await dm.getProduct()
  const productAdd = await dm.deleteProduct(4)
  console.log(products)
  console.log('borrado', productAdd)
})()
 */
