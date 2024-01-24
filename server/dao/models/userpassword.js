import mongoose from 'mongoose'

const userPasswordCollection = 'userspasswords'

const UserPasswordSchema = new mongoose.Schema({
  email: { type: 'string', required: true },
  token: { type: 'string', required: true },
  isUsed: { type: 'boolean', default: false },
  createdAt: { type: 'date', default: Date.now, expireAfterSeconds: 3600 }
})

export const UserPasswordModel = mongoose.model(userPasswordCollection, UserPasswordSchema)
