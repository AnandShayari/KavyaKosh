import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import * as poetry from '../controllers/poetryController.js';

const router = Router();

router.get('/', optionalAuth, poetry.getPoetry);
router.get('/trending', poetry.getTrending);
router.get('/featured', poetry.getFeatured);
router.get('/my', protect, poetry.getMyPoetry);
router.get('/:id', optionalAuth, poetry.getPoetryById);
router.post('/', protect, poetry.createPoetry);
router.put('/:id', protect, poetry.updatePoetry);
router.delete('/:id', protect, poetry.deletePoetry);
router.post('/:id/like', protect, poetry.likePoetry);
router.post('/:id/bookmark', protect, poetry.bookmarkPoetry);

export default router;
