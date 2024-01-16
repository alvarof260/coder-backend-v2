export default class UserServices {
  constructor (userDao) {
    this.userDao = userDao
  }

  getAll = async () => {
    return await this.userDao.getAll()
  }

  getById = async (id) => {
    return await this.userDao.getById(id)
  }

  getByEmail = async (username) => {
    return await this.userDao.getByEmail(username)
  }

  create = async (user) => {
    return await this.userDao.create(user)
  }

  update = async (id, user) => {
    return await this.userDao.update(id, user)
  }

  delete = async (id) => {
    return await this.userDao.delete(id)
  }
}
