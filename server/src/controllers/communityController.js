import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Community from '../models/Community.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { paginate, paginateResponse } from '../utils/pagination.js';

export const getPosts = asyncHandler(async (req, res) => {
  const filter = { moderationStatus: 'approved' };
  if (req.query.community) filter.community = req.query.community;
  if (req.query.hashtag) filter.hashtags = req.query.hashtag;
  const total = await Post.countDocuments(filter);
  const { query, page, limit } = paginate(
    Post.find(filter).populate('author', 'name avatar isVerified').populate('poetry'),
    req.query.page,
    req.query.limit
  );
  const data = await query.sort({ isPinned: -1, createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  const populated = await Post.findById(post._id).populate('author', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  const idx = post.likes.indexOf(req.user._id);
  if (idx > -1) post.likes.splice(idx, 1);
  else {
    post.likes.push(req.user._id);
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        title: 'New Like',
        message: `${req.user.name} liked your post`,
        link: `/community/post/${post._id}`,
      });
    }
  }
  await post.save();
  res.json({ success: true, data: { likes: post.likes.length, liked: idx === -1 } });
});

export const getComments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.post) filter.post = req.query.post;
  if (req.query.poetry) filter.poetry = req.query.poetry;
  const data = await Comment.find(filter)
    .populate('author', 'name avatar')
    .populate({ path: 'parent', populate: { path: 'author', select: 'name avatar' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({ ...req.body, author: req.user._id });
  const populated = await Comment.findById(comment._id).populate('author', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

export const getCommunities = asyncHandler(async (req, res) => {
  const total = await Community.countDocuments();
  const { query, page, limit } = paginate(Community.find().populate('creator', 'name avatar'), req.query.page, req.query.limit);
  const data = await query.sort({ memberCount: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const createCommunity = asyncHandler(async (req, res) => {
  const community = await Community.create({
    ...req.body,
    creator: req.user._id,
    members: [req.user._id],
    memberCount: 1,
  });
  res.status(201).json({ success: true, data: community });
});

export const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) throw new AppError('Community not found', 404);
  await Community.findByIdAndUpdate(req.params.id, {
    $addToSet: { members: req.user._id },
    $inc: { memberCount: 1 },
  });
  res.json({ success: true, message: 'Joined community' });
});

export const getTrendingHashtags = asyncHandler(async (_req, res) => {
  const tags = await Post.aggregate([
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
  res.json({ success: true, data: tags.map((t) => ({ tag: t._id, count: t.count })) });
});

export const getLeaderboard = asyncHandler(async (_req, res) => {
  const data = await User.find({ role: { $in: ['author', 'reader'] } })
    .sort({ writingStreak: -1 })
    .limit(20)
    .select('name avatar writingStreak badges');
  res.json({ success: true, data });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const data = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(50);
  const unread = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.json({ success: true, data, unread });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
  res.json({ success: true });
});
