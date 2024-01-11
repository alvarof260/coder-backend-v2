import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  password: { type: String, required: true }
})

export const userModel = mongoose.model(userCollection, userSchema)
