import User from '../models/User.js';
import Poetry from '../models/Poetry.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import AIHistory from '../models/AIHistory.js';
import Post from '../models/Post.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { paginate, paginateResponse } from '../utils/pagination.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [users, poetry, books, orders, posts, aiRequests] = await Promise.all([
    User.countDocuments(),
    Poetry.countDocuments(),
    Book.countDocuments(),
    Order.countDocuments(),
    Post.countDocuments(),
    AIHistory.countDocuments(),
  ]);

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
  const recentUsers = await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(10);

  res.json({
    success: true,
    data: {
      stats: { users, poetry, books, orders, posts, aiRequests, revenue: revenue[0]?.total || 0 },
      recentOrders,
      recentUsers,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) filter.$or = [
    { name: { $regex: req.query.search, $options: 'i' } },
    { email: { $regex: req.query.search, $options: 'i' } },
  ];
  const total = await User.countDocuments(filter);
  const { query, page, limit } = paginate(User.find(filter).select('-password -refreshToken'), req.query.page, req.query.limit);
  const data = await query.sort({ createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const getBooks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.$or = [
    { title: { $regex: req.query.search, $options: 'i' } },
    { category: { $regex: req.query.search, $options: 'i' } },
  ];

  const total = await Book.countDocuments(filter);
  const { query, page, limit } = paginate(
    Book.find(filter).populate('author', 'name email avatar'),
    req.query.page,
    req.query.limit
  );
  const data = await query.sort({ createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const uploadBookCover = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Book cover image is required', 400);
  const result = await uploadToCloudinary(req.file.buffer, 'kavyakosh/books');
  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url || result.url,
      publicId: result.public_id,
    },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json({ success: true, data: user });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: { isActive: user.isActive } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  await Promise.all([
    User.findByIdAndDelete(userId),
    Book.deleteMany({ author: userId }),
    Order.deleteMany({ user: userId }),
    Post.deleteMany({ author: userId }),
    AIHistory.deleteMany({ user: userId }),
  ]);

  res.json({ success: true, message: 'User removed successfully' });
});

export const getAnalytics = asyncHandler(async (_req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [userGrowth, aiUsage, topGenres, bookSales] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    AIHistory.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, requests: { $sum: 1 }, tokens: { $sum: '$tokensUsed' } } },
      { $sort: { _id: 1 } },
    ]),
    Poetry.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({ success: true, data: { userGrowth, aiUsage, topGenres, bookSales } });
});

export const getPlatformStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalPoetry, totalBooks, totalOrders] = await Promise.all([
    User.countDocuments(),
    Poetry.countDocuments({ status: 'published' }),
    Book.countDocuments({ status: 'published' }),
    Order.countDocuments({ paymentStatus: 'paid' }),
  ]);
  res.json({ success: true, data: { totalUsers, totalPoetry, totalBooks, totalOrders } });
});
