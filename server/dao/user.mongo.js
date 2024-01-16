import { UserModel } from './models/user.js'

export default class UserMongoDAO {
  get = async (username) => {
    const result = await UserModel.findOne({ email: username })
    return result
  }

  create = async (user) => {
    const result = await UserModel.create(user)
    return result
  }
}
