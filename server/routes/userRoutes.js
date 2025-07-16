// routes/userRoutes.js
import express from 'express';
import { getUserProfile, addSkillToUser, removeSkillFromUser , updateUserProfile, updatePassword} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getUserProfile);
router.put('/me', authenticateToken, addSkillToUser);
router.put('/me/skills/remove', authenticateToken, removeSkillFromUser);
// routes/userRoutes.js
router.put('/me/profile', authenticateToken, updateUserProfile);
router.put('/me/password', authenticateToken, updatePassword);




export default router;
