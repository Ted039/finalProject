import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { sendNotification } from '../controllers/notificationsController.js';

const router = express.Router();

router.post('/send', authenticateToken, sendNotification);

export default router;
