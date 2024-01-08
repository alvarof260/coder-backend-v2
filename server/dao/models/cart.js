import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        // _id: false es para que no se genere otro ID:
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, min: 0 }
      }
    ],
    default: []
  }
})

export const cartModel = mongoose.model(cartCollection, cartSchema)
