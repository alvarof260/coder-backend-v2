import nodemailer from 'nodemailer'
import config from '../config/config.js'
import { UserPasswordServices, UserServices } from '../repositories/index.js'
import { generateCode, createHash } from '../utils.js'
import logger from '../winston.js'

export const loginController = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(500)
        .render('errors/base', { error: 'error in server ' })
    }

    res
      .cookie(config.strategy.cookieName, req.user.token, { signed: true })
      .status(200)
      .redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const registerController = async (req, res) => {
  res.redirect('/')
}

export const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ status: 'error', error: 'email is required' })
    }

    const user = await UserServices.getByEmail(email)

    if (!user) {
      return res.status(404).json({ status: 'error', error: 'user not found' })
    }

    const token = generateCode()

    await UserPasswordServices.create({ email, token })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    })

    transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: 'Reset Password',
      html: `<h1>Reset Password</h1>
      <p>Click <a href="http://${req.hostname}:${config.config.port}/api/session/verify-token/${token}">here</a> to reset your password</p>`
    })

    res.status(200).json({ status: 'ok', message: 'email sent' })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const verifyTokenController = async (req, res) => {
  try {
    const { token } = req.params

    logger.info(token)
    if (!token) {
      return res.status(400).json({ status: 'error', error: 'token is required' })
    }

    const userPassword = await UserPasswordServices.getByToken(token)

    logger.info(userPassword)
    if (userPassword == null) {
      return res.status(404).json({ status: 'error', error: 'token not found' })
    }

    res.render('session/reset-password', {
      title: 'CoderShop | Reset Password',
      style: 'login.css',
      token
    })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}
export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const userPassword = await UserPasswordServices.getByToken(token)
    const user = await UserServices.getByEmail(userPassword.email)
    const userUpdated = await UserServices.update(user._id, { password: createHash(password) })
    if (userUpdated == null) {
      return res.status(404).json({ status: 'error', error: 'user not found' })
    }
    await UserPasswordServices.delete(userPassword._id)
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const githubController = (req, res) => {}

export const githubCallbackController = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(500)
        .render('errors/base', { error: 'error in server ' })
    }
    res
      .cookie(config.strategy.cookieName, req.user.token, { signed: true })
      .status(200)
      .redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const logoutController = (req, res) => {
  // Destruir la sesión y redirigir a la página principal
  res.clearCookie(config.strategy.cookieName).redirect('/')
}
