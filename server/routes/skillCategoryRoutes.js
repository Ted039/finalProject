
import express from 'express'
import SkillCategory from '../models/SkillCategory.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const categories = await SkillCategory.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
})

export default router
