import mongoose from 'mongoose'

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
}, { timestamps: true })

export const TicketModel = mongoose.model(ticketCollection, ticketSchema)
