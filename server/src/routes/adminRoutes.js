import { Router } from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import * as admin from '../controllers/adminController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads are allowed'));
    cb(null, true);
  },
});

router.use(protect, authorize('admin', 'moderator'));

router.get('/dashboard', admin.getDashboardStats);
router.get('/analytics', admin.getAnalytics);
router.get('/users', admin.getUsers);
router.get('/books', admin.getBooks);
router.post('/books/cover', authorize('admin'), upload.single('cover'), admin.uploadBookCover);
router.put('/users/:id/role', authorize('admin'), admin.updateUserRole);
router.put('/users/:id/toggle-status', authorize('admin'), admin.toggleUserStatus);
router.delete('/users/:id', authorize('admin'), admin.deleteUser);

export default router;
