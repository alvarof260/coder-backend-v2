export default class CartRepository {
  constructor (cartDao) {
    this.cartDao = cartDao
  }

  getById = async (id) => {
    return await this.cartDao.getById(id)
  }

  getProductsFromCart = async (req, res) => {
    return await this.cartDao.getProductsFromCart(req, res)
  }

  create = async () => {
    return await this.cartDao.create()
  }

  update = async (id, cart) => {
    return await this.cartDao.update(id, cart)
  }

  delete = async (id) => {
    return await this.cartDao.delete(id)
  }
}
