import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

export class CartManager {
  #path
  constructor (path) {
    this.#path = path
    this.#init()
  }

  #init = async () => {
    if (!existsSync(this.#path)) {
      await writeFile(this.#path, JSON.stringify([], null, '\t'))
    }
  }

  #generateID = (carts) => {
    return (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1
  }

  #atomicWriteFile = async (carts) => {
    try {
      // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
      await writeFile(this.#path, JSON.stringify(carts, null, '\t'))
    } catch (err) {
      console.error('Error writing DB file.', err)
      throw new Error('No se pudo escribir en el archivo.') // Propagar el error para un manejo superior
    }
  }

  #getCarts = async () => {
    const data = await readFile(this.#path, 'utf-8')
    const carts = JSON.parse(data)
    return carts
  }

  createCart = async () => {
    try {
      const carts = await this.#getCarts()
      const cartToAdd = { id: this.#generateID(carts), products: [] }
      carts.push(cartToAdd)
      await this.#atomicWriteFile(carts)
      return cartToAdd
    } catch (error) {
      console.error('Error creating cart.')
    }
  }

  getProductsFromCart = async (cartId) => {
    try {
      const carts = await this.#getCarts()
      const cart = carts.find(el => el.id === cartId)
      if (!cart) return
      return cart
    } catch (error) {
      console.error('Error fetching carts.')
    }
  }

  addProductFromCart = async (cartId, prodId) => {
    try {
      const carts = await this.#getCarts()
      const cartIndex = carts.findIndex(el => el.id === cartId)
      if (cartIndex === -1) {
        console.error('Cart not found.')
        return
      }

      const cart = carts[cartIndex]
      const prodIndex = cart.products.findIndex(el => el.product === prodId)
      if (prodIndex > -1) {
        cart.products[prodIndex].quantity++
      } else {
        cart.products.push({ product: prodId, quantity: 1 })
      }
      await this.#atomicWriteFile(carts)
      return cart
    } catch (error) {
      console.error('Error fetching carts.')
    }
  }
}

/* (async () => {
  const CM = new CartManager('./src/data/carts.json')
  const cart = await CM.addProductFromCart(1, 4)
  console.log(cart)
})() */
