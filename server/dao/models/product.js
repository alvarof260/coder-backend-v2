import mongoose from 'mongoose'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: [String], default: [] },
  code: { type: String, required: true, trim: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  status: { type: Boolean, default: true, enum: [true, false] },
  category: { type: String, required: true, enum: ['Home', 'Electronic', 'Clothing', 'Sports'] }
})

export const productsModel = mongoose.model(productsCollection, productsSchema)
