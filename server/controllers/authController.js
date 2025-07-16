import User from '../models/User.js'
import { generateToken } from '../utils/token.js'

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)
  res.json({ user, token })
}
