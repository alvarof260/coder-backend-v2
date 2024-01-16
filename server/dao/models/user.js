import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' }
})

export const UserModel = mongoose.model(userCollection, userSchema)
