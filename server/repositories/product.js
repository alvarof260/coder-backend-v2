export default class ProductRepository {
  constructor (productDao) {
    this.productDao = productDao
  }

  getAll = async () => {
    return await this.productDao.getAll()
  }

  getAllView = async () => {
    return await this.productDao.getAllView()
  }

  getById = async (id) => {
    return await this.productDao.getById(id)
  }

  getAllPaginates = async (req, res) => {
    return await this.productDao.getAllPaginates(req, res)
  }

  create = async (product) => {
    return await this.productDao.create(product)
  }

  update = async (id, product) => {
    return await this.productDao.update(id, product)
  }

  delete = async (id) => {
    return await this.productDao.delete(id)
  }
}
