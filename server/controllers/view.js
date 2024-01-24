import config from '../config/config.js'
import { verifyToken } from '../utils.js'
import UserDto from '../dto/user.js'

export const loginViewController = (req, res) => {
  res.render('session/login', {
    title: 'CoderShop | Login',
    style: 'login.css'
  })
}

export const registerViewController = (req, res) => {
  res.render('session/register', {
    title: 'CoderShop | Register',
    style: 'login.css'
  })
}

export const forgetPasswordViewController = (req, res) => {
  res.render('session/forget-password', {
    title: 'CoderShop | Forget Password',
    style: 'login.css'
  })
}

export const profileViewController = (req, res) => {
  const decoded = verifyToken(req.signedCookies[config.strategy.cookieName])
  const user = new UserDto(decoded.user)
  res.render('session/profile', {
    title: 'CoderShop | Profile',
    style: 'login.css',
    user
  })
}

export const failRegisterViewController = (req, res) => {
  res.render('errors/base', { error: 'Passport register failed.' })
}

export const failLoginViewController = (req, res) => {
  res.render('errors/base', { error: 'Passport login failed.' })
}
