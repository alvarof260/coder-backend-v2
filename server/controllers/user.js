import { UserServices } from '../repositories/index.js'

export const changeRoleController = async (req, res) => {
  try {
    const { uid } = req.params
    const user = await UserServices.getById(uid)
    if (user === null) { res.status(404).json({ status: 'error', error: 'user not found' }) }
    user.role === 'user' ? (user.role = 'premium') : (user.role = 'user')
    await UserServices.update(uid, user)
    res.status(200).json({ status: 'success', payload: user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const uploadDocumentsController = async (req, res) => {
  try {
    const { uid } = req.params
    const userUpdates = req.files.map(async (file) => {
      await UserServices.update(uid, {
        $push: {
          document: {
            name: file.originalname,
            url: file.path
          }
        }
      })
    })
    res.status(200).json({ status: 'success', payload: userUpdates })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
