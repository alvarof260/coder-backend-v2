import config from '../config/config.js'

export const loginController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(500).render('errors/base', { error: 'error in server ' })
    }

    res.cookie(config.strategy.cookieName, req.user.token, { signed: true }).status(200).redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const registerController = async (req, res) => {
  res.redirect('/')
}

export const githubController = (req, res) => {

}

export const githubCallbackController = (req, res) => {
  try {
    if (!req.user) {
      return res.status(500).render('errors/base', { error: 'error in server ' })
    }
    res.cookie(config.strategy.cookieName, req.user.token, { signed: true }).status(200).redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const logoutController = (req, res) => {
  // Destruir la sesión y redirigir a la página principal
  res.clearCookie(config.strategy.cookieName).redirect('/')
}
