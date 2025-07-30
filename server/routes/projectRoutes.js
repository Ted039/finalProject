import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getActiveProjects,
  startProject
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', authenticateToken, getActiveProjects);
router.post('/start', authenticateToken, startProject);

export default router;
