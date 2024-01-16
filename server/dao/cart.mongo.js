import { CartModel } from './models/cart.js'

export default class CartMongoDao {
  getById = async (id) => {
    const result = await CartModel.findById(id)
    return result
  }

  getProductsFromCart = async (req, res) => {
    try {
      const cid = req.params.cid
      const result = await CartModel.findById(cid).populate('products.product').lean()
      if (result === null) return res.status(404).json({ status: 'error', error: `cart id: ${cid} not found.` })
      return {
        statusCode: 200,
        response: {
          status: 'success',
          payload: result
        }
      }
    } catch (err) {
      return {
        statusCode: 500,
        response: { status: 'error', error: err.message }
      }
    }
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
