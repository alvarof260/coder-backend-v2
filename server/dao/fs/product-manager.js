import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

export class ProductManager {
  #path
  constructor (path) {
    this.#path = path
    this.#init() // inicializar la ruta donde se guarda los productos
  }

  // Inicializa el archivo de productos si no existe
  #init = async () => {
    try {
      if (!existsSync(this.#path)) {
        await writeFile(this.#path, JSON.stringify([], null, '\t'))
      }
    } catch (err) {
      console.error('Error initializing file: ', err)
      throw new Error('Unable to initialize the file.')
    }
  }

  // Obtiene todos los productos del archivo
  getProducts = async () => {
    try {
      const response = await readFile(this.#path, 'utf-8')
      const products = JSON.parse(response)
      return products
    } catch (err) {
      console.error('Error reading file: ', err)
      throw new Error('Unable to read the file.')
    }
  }

  // Obtiene un producto por su ID
  getProductByID = async (id) => {
    try {
      const products = await this.getProducts()
      const product = products.find(el => el.id === id)
      if (!product) return
      return product
    } catch (err) {
      console.error('Error finding product:', err)
      throw new Error('Unable to find the product.')
    }
  }

  // Agrega un nuevo producto al archivo
  addProduct = async (product) => {
    try {
      // Validación de datos del producto
      const { title, description, price, thumbnail, code, stock, status } = product
      const thumbnailValue = thumbnail || []
      const statusValue = status
      if (!title || !description || !price || !code || !stock) return
      // Obtención de los productos existentes y generación de ID
      const products = await this.getProducts()
      const found = this.#verifyCode(products, code)
      if (found) return
      const id = this.#generateID(products)
      // Creación del nuevo producto
      const productToAdd = {
        title,
        description,
        price,
        thumbnail: thumbnailValue,
        code,
        stock,
        status: statusValue,
        id
      }
      // Agregar el nuevo producto y escribir en el archivo
      products.push(productToAdd)
      await this.#atomicWriteFile(products)
      return productToAdd
    } catch (err) {
      console.error('Error adding product:', err)
      throw new Error('Unable to add the product.')
    }
  }

  // Actualiza un producto existente
  updateProduct = async (itemId, dataUpdate) => {
    try {
      const products = await this.getProducts()
      // Actualización de los datos del producto
      const productsUpdated = products.map(el => {
        if (el.id === itemId) return { ...el, ...dataUpdate }
        else return el
      })
      await this.#atomicWriteFile(productsUpdated)
      const productUpdate = await this.getProductByID(itemId)
      return productUpdate
    } catch (err) {
      console.error('Error updating product:', err)
      throw new Error('Unable to update the product.')
    }
  }

  // Elimina un producto por su ID
  deleteProduct = async (itemId) => {
    try {
      const products = await this.getProducts()
      const productExist = products.some(el => el.id === itemId)
      if (!productExist) return
      const productsUpdate = products.filter(el => el.id !== itemId)
      await this.#atomicWriteFile(productsUpdate)
      return productsUpdate
    } catch (err) {
      console.error('Error deleting product:', err)
      throw new Error('Unable to delete the product.')
    }
  }

  #verifyCode = (products, newCode) => { return products.find(el => el.code === newCode) }

  // Genera un nuevo ID para un producto
  #generateID = (products) => {
    return (products.length === 0) ? 1 : products[products.length - 1].id + 1
  }

  // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
  #atomicWriteFile = async (products) => {
    try {
      await writeFile(this.#path, JSON.stringify(products, null, '\t'))
    } catch (err) {
      console.error('Error writing to file:', err)
      throw new Error('Unable to write to the file.')
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
