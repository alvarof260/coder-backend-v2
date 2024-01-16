import { ProductModel } from './models/product.js'

export default class ProductMongoDao {
  getAll = async () => {
    const result = await ProductModel.find()
    return result
  }

  getById = async (id) => {
    const result = await ProductModel.findById(id)
    return result
  }

  create = async (product) => {
    const result = await ProductModel.create(product)
    return result
  }

  update = async (id, product) => {
    const result = await ProductModel.findOneAndUpdate({ _id: id }, product, { returnDocument: 'after' })
    return result
  }

  delete = async (id) => {
    const result = await ProductModel.findOneAndDelete({ _id: id }, { returnDocument: 'after' })
    return result
  }
}
