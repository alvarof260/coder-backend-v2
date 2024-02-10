import nodemailer from 'nodemailer'

import { UserServices } from '../repositories/index.js'
import { generateToken } from '../utils.js'
import Userv2Dto from '../dto/userv2.js'
import config from '../config/config.js'

export const changeRoleController = async (req, res) => {
  try {
    const { uid } = req.params
    const user = await UserServices.getById(uid)
    if (user === null) { res.status(404).json({ status: 'error', error: 'user not found' }) }
    if (user.document.length === 3) {
      user.role === 'user' ? (user.role = 'premium') : (user.role = 'user')
    }
    await UserServices.update(uid, user)
    const token = generateToken(user)
    user.token = token
    console.log(user.token)
    res.clearCookie(config.strategy.cookieName)
    res.cookie(config.strategy.cookieName, user.token, { signed: true })
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

export const getProfilesController = async (req, res) => {
  try {
    const users = await UserServices.getAll()
    const usersDto = users.map((user) => new Userv2Dto(user))
    res.status(200).json({ status: 'success', payload: usersDto })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteUsersController = async (req, res) => {
  try {
    const users = await UserServices.getAll()
    const dateNow = new Date()
    const usersDeleted = []
    console.log(users)
    console.log(dateNow)
    users.map(async (user) => {
      if (new Date(user.last_connection) < dateNow.setDate(dateNow.getDate() - 2)) {
        console.log(new Date(user.last_connection))
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.email.user,
            pass: config.email.password
          }
        })

        transporter.sendMail({
          from: config.email.user,
          to: user.email,
          subject: 'Account Deleted',
          html: `<h1>Your account are deleted</h1>
                <br>
                <p>Sorry, your account has been deleted due to inactivity for more than 2 days</p>`
        })

        usersDeleted.push(user)
        console.log('user deleted')
        await UserServices.delete(user._id)
      } else {
        console.log('user not deleted')
      }
    })
    res.status(200).json({ status: 'success', payload: usersDeleted })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
