import Poetry from '../models/Poetry.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { paginate, paginateResponse, buildSort, buildFilter } from '../utils/pagination.js';

export const getPoetry = asyncHandler(async (req, res) => {
  const filter = buildFilter({ ...req.query, status: 'published', visibility: 'public' });
  const sort = buildSort(req.query.sortBy, req.query.order);
  const total = await Poetry.countDocuments(filter);
  const { query, page, limit } = paginate(Poetry.find(filter).populate('author', 'name avatar isVerified'), req.query.page, req.query.limit);
  const data = await query.sort(sort);
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const getPoetryById = asyncHandler(async (req, res) => {
  const poetry = await Poetry.findById(req.params.id).populate('author', 'name avatar bio followers');
  if (!poetry) throw new AppError('Poetry not found', 404);
  poetry.views += 1;
  await poetry.save({ validateBeforeSave: false });
  res.json({ success: true, data: poetry });
});

export const createPoetry = asyncHandler(async (req, res) => {
  const poetry = await Poetry.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: poetry });
});

export const updatePoetry = asyncHandler(async (req, res) => {
  let poetry = await Poetry.findById(req.params.id);
  if (!poetry) throw new AppError('Poetry not found', 404);
  if (poetry.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }
  poetry = await Poetry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: poetry });
});

export const deletePoetry = asyncHandler(async (req, res) => {
  const poetry = await Poetry.findById(req.params.id);
  if (!poetry) throw new AppError('Poetry not found', 404);
  if (poetry.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }
  await poetry.deleteOne();
  res.json({ success: true, message: 'Deleted' });
});

export const likePoetry = asyncHandler(async (req, res) => {
  const poetry = await Poetry.findById(req.params.id);
  if (!poetry) throw new AppError('Poetry not found', 404);
  const idx = poetry.likes.indexOf(req.user._id);
  if (idx > -1) poetry.likes.splice(idx, 1);
  else poetry.likes.push(req.user._id);
  await poetry.save();
  res.json({ success: true, data: { likes: poetry.likes.length, liked: idx === -1 } });
});

export const bookmarkPoetry = asyncHandler(async (req, res) => {
  const poetry = await Poetry.findById(req.params.id);
  if (!poetry) throw new AppError('Poetry not found', 404);
  const idx = poetry.bookmarks.indexOf(req.user._id);
  if (idx > -1) poetry.bookmarks.splice(idx, 1);
  else poetry.bookmarks.push(req.user._id);
  await poetry.save();
  res.json({ success: true, data: { bookmarked: idx === -1 } });
});

export const getTrending = asyncHandler(async (req, res) => {
  const data = await Poetry.find({ status: 'published' })
    .sort({ views: -1, 'likes.length': -1 })
    .limit(12)
    .populate('author', 'name avatar');
  res.json({ success: true, data });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const data = await Poetry.find({ featured: true, status: 'published' })
    .limit(8)
    .populate('author', 'name avatar');
  res.json({ success: true, data });
});

export const getMyPoetry = asyncHandler(async (req, res) => {
  const filter = { author: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const total = await Poetry.countDocuments(filter);
  const { query, page, limit } = paginate(Poetry.find(filter), req.query.page, req.query.limit);
  const data = await query.sort({ createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});
