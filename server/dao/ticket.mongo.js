import { TicketModel } from './models/ticket.js'

export default class TicketMongoDAO {
  getAll = async () => {
    return await TicketModel.find()
  }

  getById = async (id) => {
    return await TicketModel.findById(id)
  }

  getByCode = async (code) => {
    return await TicketModel.findOne({ code })
  }

  create = async (ticket) => {
    return await TicketModel.create(ticket)
  }

  update = async (id, ticket) => {
    return TicketModel.findOneAndUpdate({ _id: id }, ticket, { returnDocument: 'after' })
  }

  delete = async (id) => {
    return TicketModel.findOneAndDelete({ _id: id }, { returnDocument: 'after' })
  }
}
