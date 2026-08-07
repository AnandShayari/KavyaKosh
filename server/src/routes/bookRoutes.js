import { Router } from 'express';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import * as book from '../controllers/bookController.js';

const router = Router();

router.get('/', optionalAuth, book.getBooks);
router.get('/featured', book.getFeaturedBooks);
router.get('/bestsellers', book.getBestsellers);
router.get('/cart', protect, book.getCart);
router.post('/cart', protect, book.addToCart);
router.delete('/cart/:itemId', protect, book.removeFromCart);
router.get('/wishlist', protect, book.getWishlist);
router.post('/wishlist', protect, book.toggleWishlist);
router.post('/orders', protect, book.createOrder);
router.get('/orders', protect, book.getOrders);
router.get('/orders/:id', protect, book.getOrderById);
router.get('/:id', optionalAuth, book.getBookById);
router.post('/', protect, authorize('author', 'admin'), book.createBook);

export default router;
