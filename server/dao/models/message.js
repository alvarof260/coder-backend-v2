import mongoose from 'mongoose'

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true }
})

export const MessageModel = mongoose.model(messageCollection, messageSchema)
