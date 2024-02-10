import { UserModel } from './models/user.js'

export default class UserMongoDAO {
  getAll = async () => {
    return await UserModel.find()
  }

  getAllView = async () => {
    return await UserModel.find().lean().exec()
  }

  getByEmail = async (username) => {
    return await UserModel.findOne({ email: username })
  }

  getById = async (id) => {
    return await UserModel.findById(id)
  }

  create = async (user) => {
    return await UserModel.create(user)
  }

  update = async (id, user) => {
    return await UserModel.findOneAndUpdate({ _id: id }, user, { returnDocument: 'after' })
  }

  delete = async (id) => {
    return await UserModel.findOneAndDelete({ _id: id }, { returnDocument: 'after' })
  }
}
