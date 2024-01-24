import { UserPasswordModel } from './models/userpassword.js'

export default class UserPasswordDao {
  create = async (user) => {
    return await UserPasswordModel.create(user)
  }

  getByToken = async (token) => {
    return await UserPasswordModel.findOne({ token })
  }

  delete = async (id) => {
    return await UserPasswordModel.findByIdAndDelete(id)
  }
}
