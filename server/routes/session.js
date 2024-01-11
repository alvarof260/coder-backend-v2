import { Router } from 'express'
import { userModel } from '../dao/models/user.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', error: 'Email and password are not optional' })
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
