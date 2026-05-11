import { Router } from 'express';
import projectRouter from './v1/projects';
const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'API Gateway is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount routes
router.use('/v1/projects', projectRouter);


export default router;