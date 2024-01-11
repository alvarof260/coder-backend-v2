import { Router } from 'express'
import { userModel } from '../dao/models/user.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', error: 'Email and password are not optional.' })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ status: 'error', error: `User with email: ${email} not found.` })
    }
    if (user.password !== password) return res.status(400).json({ status: 'error', error: 'The password is incorrect, try again.' })
    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age
    }
    res.redirect('/products')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', error: 'Email and password are not optional.' })
    }
    const user = await userModel.findOne({ email })
    if (user) {
      res.redirect('/register')
    }
    await userModel.create(req.body)
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

export default router
