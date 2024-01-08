import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: [String], default: [] },
  code: { type: String, required: true, trim: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  status: { type: Boolean, default: true, enum: [true, false] },
  category: { type: String, required: true, enum: ['Home', 'Electronic', 'Clothing', 'Sports'] }
})

productSchema.plugin(paginate)

export const productModel = mongoose.model(productCollection, productSchema)
