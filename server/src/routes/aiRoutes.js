import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import * as ai from '../controllers/aiController.js';

const router = Router();

router.post('/generate', optionalAuth, aiLimiter, ai.streamGenerate);
router.post('/action', optionalAuth, aiLimiter, ai.performAction);
router.post('/review', protect, aiLimiter, ai.reviewContent);
router.get('/history', protect, ai.getAIHistory);
router.get('/stats', protect, ai.getAIStats);

export default router;
