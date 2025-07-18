import express from 'express';
import { sendSwapRequest, getMyRequests, respondToRequest } from '../controllers/swapController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, sendSwapRequest);
router.get('/', authenticateToken, getMyRequests);
router.put('/:id/respond', authenticateToken, respondToRequest);

export default router;
