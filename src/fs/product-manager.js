import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

class ProductManager {
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
      const response = await readFile(this.#path, 'utf-8')
      const products = JSON.parse(response)
      return products
    } catch (err) {
      console.error('Error al leer el archivo', err)
    }
  }

  addProduct = async (product) => {
    try {
      const { title, description, price, thumbnail, code, stock } = product
      const products = await this.getProduct()
      const id = this.generateID(products)
      const productToAdd = { title, description, price, thumbnail, code, stock, id }
      products.push(productToAdd)
      await this.atomicWriteFile(products)
      return { sucess: true, payload: productToAdd }
    } catch (err) {
      console.error('Error al añadir el producto al archivo', err)
      throw new Error('No se pudo añadir el producto')
    }
  }

  generateID = (products) => {
    return (products.length === 0) ? 1 : products[products.length - 1].id + 1
  }

  atomicWriteFile = async (products) => {
    try {
      // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
      await writeFile(this.#path, JSON.stringify(products, null, '\t'))
    } catch (err) {
      console.error('Error al escribir en el archivo', err)
      throw new Error('No se pudo escribir en el archivo') // Propagar el error para un manejo superior
    }
  }
}
(async () => {
  const dm = new ProductManager('src/data/products.json')
  const products = await dm.getProduct()
  const productAdd = await dm.addProduct({
    title: 'Libreta de Notas',
    description: 'Libreta con tapa dura y páginas rayadas',
    price: 9.99,
    thumbnail: 'https://ejemplo.com/libreta.png',
    code: 'LB_RAYADA_003'
  })
  console.log(products)
  console.log(productAdd)
})()
