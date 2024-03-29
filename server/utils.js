import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { fakerES as faker } from '@faker-js/faker'
import multer from 'multer'

import config from './config/config.js'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => {
  const token = jwt.sign({ user }, config.strategy.key, { expiresIn: '24h' })
  return token
}

export const verifyToken = (token) => {
  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, config.strategy.key) // Reemplaza 'secret' con tu clave secreta

    // La variable 'decoded' ahora contiene la información del token
    return decoded
  } catch (error) {
    // Manejar errores, como token expirado o inválido
    console.error('Error al verificar el token:', error.message)
    return null
  }
}

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err)
      if (!user) {
        return res.status(401).json({ status: 'error', error: info.message ? info.message : info.toString() })
      }
      req.user = user
      next()
    })(req, res, next)
  }
}

export const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const generateProducts = () => {
  const products = []
  for (let i = 0; i < 100; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      thumbnail: [faker.image.url()],
      code: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
      stock: faker.number.int({ max: 100 }),
      category: faker.commerce.department()
    })
  }
  return products
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = __dirname + '/docs/'
    switch (file.fieldname) {
      case 'profiles':
        path += 'profiles'
        break
      case 'products':
        path += 'products'
        break
      case 'documents':
        path += 'documents'
        break
    }
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

export const uploader = multer({ storage })
/*
export const verifyProduct = (product) => {
  const message = {}
  if (product.title && typeof product.title !== 'string') {
    message.title = 'Title must be a String'
  }
  if (product.description && typeof product.description !== 'string') {
    message.description = 'Description must be a String'
  }
  if (product.price && typeof product.price !== 'number') {
    message.price = 'Price must be a Number'
  }
  if (product.thumbnail) {
    if (!Array.isArray(product.thumbnail)) {
      message.thumbnail = 'Thumbnail must be an Array'
    }
  }
  if (product.code && typeof product.code !== 'string') {
    message.code = 'Code must be a String'
  }
  if (product.stock && typeof product.stock !== 'number') {
    message.stock = 'Stock must be a Number'
  }
  return Object.keys(message).length > 0 ? message : null
}

export const verifyProductPartial = (product) => {
  const message = {}
  if (typeof product.title !== 'string' && product.title) {
    message.title = 'Title must be a String'
  }
  if (typeof product.description !== 'string' && product.description) {
    message.description = 'Description must be a String'
  }
  if (typeof product.price !== 'number' && product.price) {
    message.price = 'Price must be a Number'
  }
  if (Array.isArray(product.thumbnail) === false && product.thumbnail) {
    message.thumbnail = 'Thumbnail must be a Array'
  }
  if (typeof product.code !== 'string' && product.code) {
    message.thumbnail = 'Code must be a String'
  }
  if (typeof product.stock !== 'number' && product.stock) {
    message.stock = 'Stock must be a Number'
  }
  return Object.keys(message).length > 0 ? message : null
}
*/
