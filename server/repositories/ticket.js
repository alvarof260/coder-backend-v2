export default class TicketRepository {
  constructor (ticketDao) {
    this.ticketDao = ticketDao
  }

  getAll = async () => {
    return await this.ticketDao.getAll()
  }

  getById = async (id) => {
    return await this.ticketDao.getById(id)
  }

  getByCode = async (code) => {
    return await this.ticketDao.getByCode(code)
  }

  create = async (ticket) => {
    return await this.ticketDao.create(ticket)
  }

  update = async (id, ticket) => {
    return await this.ticketDao.update(id, ticket)
  }

  delete = async (id) => {
    return await this.ticketDao.delete(id)
  }
}
