import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

export class CartManager {
  #path
  constructor (path) {
    this.#path = path
    this.#init()
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

  // Genera un nuevo ID para un carrito
  #generateID = (carts) => {
    return (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1
  }

  // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
  #atomicWriteFile = async (carts) => {
    try {
      await writeFile(this.#path, JSON.stringify(carts, null, '\t'))
    } catch (err) {
      console.error('Error writing to file:', err)
      throw new Error('Unable to write to the file.')
    }
  }

  // Obtiene todos los carritos del archivo
  #getCarts = async () => {
    try {
      const data = await readFile(this.#path, 'utf-8')
      const carts = JSON.parse(data)
      return carts
    } catch (err) {
      console.error('Error reading file: ', err)
      throw new Error('Unable to read the file.')
    }
  }

  // Crea y agrega un nuevo carrito al archivo
  createCart = async () => {
    try {
      const carts = await this.#getCarts()
      const cartToAdd = { id: this.#generateID(carts), products: [] }
      carts.push(cartToAdd)
      await this.#atomicWriteFile(carts)
      return cartToAdd
    } catch (error) {
      console.error('Error creating cart.')
      throw new Error('Unable to create to the file')
    }
  }

  // Obtiene un carrito por su ID
  getProductsFromCart = async (cartId) => {
    try {
      const carts = await this.#getCarts()
      const cart = carts.find(el => el.id === cartId)
      if (!cart) return
      return cart
    } catch (error) {
      console.error('Error fetching carts.')
      throw new Error('Unable to create to the file')
    }
  }

  // Agrega un producto al carrito
  addProductFromCart = async (cartId, prodId) => {
    try {
      const carts = await this.#getCarts()
      const cartIndex = carts.findIndex(el => el.id === cartId) // busca por la posicion en el array si existe o no el carrito
      if (cartIndex === -1) {
        console.error('Cart not found.')
        return
      }

      const cart = carts[cartIndex] // obtiene el carrito para poder agregar los productos
      const prodIndex = cart.products.findIndex(el => el.product === prodId)
      /*
      si ya existe el producto en el array de productos se le suma 1 a la cantidad
      y si no existe se agrega el producto con cantidad 1
      */
      if (prodIndex > -1) {
        cart.products[prodIndex].quantity++
      } else {
        cart.products.push({ product: prodId, quantity: 1 })
      }
      await this.#atomicWriteFile(carts)
      return cart
    } catch (error) {
      console.error('Error adding product to cart.')
      throw new Error('Unable to add product to the file')
    }
  }
}
