import mongoose from 'mongoose'

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        // _id: false es para que no se genere otro ID:
        _id: false,
        product: { type: mongoose.Schema.Types.products, ref: 'products' },
        quantity: { type: Number, min: 0 }
      }
    ],
    default: []
  }
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)
