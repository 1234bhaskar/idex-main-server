import express from 'express';
import { createProjectController, getProjectTreeController } from '../../controllers/project.controller';

const router = express.Router();

router.post('/', createProjectController)
router.get('/:projectId', getProjectTreeController);

export default router;