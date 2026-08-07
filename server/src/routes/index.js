import { Router } from 'express';
import authRoutes from './authRoutes.js';
import poetryRoutes from './poetryRoutes.js';
import bookRoutes from './bookRoutes.js';
import aiRoutes from './aiRoutes.js';
import communityRoutes from './communityRoutes.js';
import adminRoutes from './adminRoutes.js';
import { getPlatformStats } from '../controllers/adminController.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/poetry', poetryRoutes);
router.use('/books', bookRoutes);
router.use('/ai', aiRoutes);
router.use('/community', communityRoutes);
router.use('/admin', adminRoutes);
router.get('/stats', getPlatformStats);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'KavyaKosh API is running', timestamp: new Date().toISOString() });
});

export default router;
