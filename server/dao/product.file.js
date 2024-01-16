import { ProductManager } from './fs/product-manager.js'

export default class UserFileDao {
  constructor () {
    this.productManager = new ProductManager()
  }

  getAll = async () => {
    return await this.productManager.getProducts()
  }

  getById = async (id) => {
    return await this.productManager.getProductByID(id)
  }

  create = async (product) => {
    return await this.productManager.addProduct(product)
  }

  update = async (id, product) => {
    return await this.productManager.updateProduct(id, product)
  }

  delete = async (id) => {
    return await this.productManager.deleteProduct(id)
  }
}
