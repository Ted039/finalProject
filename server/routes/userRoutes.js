// routes/userRoutes.js
import express from 'express';
import { getUserProfile, addSkillToUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getUserProfile, addSkillToUser);

export default router;
