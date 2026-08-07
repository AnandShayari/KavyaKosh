import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as community from '../controllers/communityController.js';

const router = Router();

router.get('/posts', community.getPosts);
router.post('/posts', protect, community.createPost);
router.post('/posts/:id/like', protect, community.likePost);
router.get('/comments', community.getComments);
router.post('/comments', protect, community.createComment);
router.get('/communities', community.getCommunities);
router.post('/communities', protect, community.createCommunity);
router.post('/communities/:id/join', protect, community.joinCommunity);
router.get('/trending-hashtags', community.getTrendingHashtags);
router.get('/leaderboard', community.getLeaderboard);
router.get('/notifications', protect, community.getNotifications);
router.put('/notifications/:id/read', protect, community.markNotificationRead);
router.put('/notifications/read-all', protect, community.markAllNotificationsRead);

export default router;
