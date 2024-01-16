import { CartManager } from './fs/cart-manager.js'

export default class CartFileDao {
  constructor () {
    this.cartManager = new CartManager()
  }

  getById = async (id) => {
    return await this.cartManager.getProductsFromCart(id)
  }

  create = async () => {
    return await this.cartManager.createCart()
  }

  addProduct = async (id, prodId) => {
    return await this.cartManager.addProductFromCart(id, prodId)
  }
}
