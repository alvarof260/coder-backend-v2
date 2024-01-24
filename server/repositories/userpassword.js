export default class UserPasswrodRepository {
  constructor (userPasswordDao) {
    this.userPasswordDao = userPasswordDao
  }

  create = async (user) => {
    return await this.userPasswordDao.create(user)
  }

  getByToken = async (token) => {
    return await this.userPasswordDao.getByToken(token)
  }

  delete = async (id) => {
    return await this.userPasswordDao.delete(id)
  }
}
