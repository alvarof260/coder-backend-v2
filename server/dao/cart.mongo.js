import { CartModel } from './models/cart.js'

export default class CartMongoDao {
  getById = async (id) => {
    const result = await CartModel.findById(id)
    return result
  }

  create = async () => {
    const result = await CartModel.create({})
    return result
  }

  update = async (id, cart) => {
    const result = await CartModel.findOneAndUpdate({ _id: id }, cart, { returnDocument: 'after' })
    return result
  }

  delete = async (id) => {
    const result = await CartModel.findOneAndDelete({ _id: id }, { returnDocument: 'after' })
    return result
  }
}
