import mongoose from 'mongoose'

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
})

export const TicketModel = mongoose.model(ticketCollection, ticketSchema)
