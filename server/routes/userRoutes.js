import express from 'express'
import {
  getUserProfile,
  addSkillToUser,
  removeSkillFromUser,
  updateUserProfile,
  updatePassword,
  getAllOtherUsers,
  getAllUsers 
} from '../controllers/userController.js'

import { authenticateToken } from '../middleware/authMiddleware.js'
import multer from 'multer'


const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/me', authenticateToken, getUserProfile)
router.put('/me', authenticateToken, addSkillToUser)
router.put('/me/skills/remove', authenticateToken, removeSkillFromUser)
router.put('/me/password', authenticateToken, updatePassword)
router.put('/me/profile', authenticateToken, upload.single('avatar'), updateUserProfile)
router.get('/others', authenticateToken, getAllOtherUsers)
router.get('/', authenticateToken, getAllUsers)

export default router
