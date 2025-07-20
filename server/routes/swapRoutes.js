import express from 'express'
import {
  sendSwapRequest,
  getMyRequests,
  respondToRequest
} from '../controllers/swapController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// 📩 Create a new swap request
router.post('/request', authenticateToken, sendSwapRequest)

// 📥 Get all swap requests for the logged-in user
router.get('/', authenticateToken, getMyRequests)

// ✅ Respond to a request (approve or decline)
router.put('/:id/respond', authenticateToken, respondToRequest)

export default router
