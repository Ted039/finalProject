import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getActiveProjects, startProject, approveProject, cancelProject, getProjectById, addProjectMessage, addProjectNote, addProjectResource} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', authenticateToken, getActiveProjects);
router.post('/start', authenticateToken, startProject);
router.post('/approve',authenticateToken ,approveProject);
router.put('/projects/cancel/:projectId', authenticateToken, cancelProject);
router.get('/projects/:id', authenticateToken, getProjectById);
router.post('/projects/:id/message', authenticateToken, addProjectMessage);
router.post('/projects/:id/note', authenticateToken, addProjectNote);
router.post('/projects/:id/resource', authenticateToken, addProjectResource);


export default router;
