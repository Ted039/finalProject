import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = await User.create({ username, email, password })
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
