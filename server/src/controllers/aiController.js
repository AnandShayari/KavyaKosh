import { generatePoetry, aiAction, aiReview } from '../services/aiService.js';
import AIHistory from '../models/AIHistory.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { paginate, paginateResponse } from '../utils/pagination.js';

export const streamGenerate = async (req, res) => {
  await generatePoetry(req.user?._id, req.body, res);
};

export const performAction = asyncHandler(async (req, res) => {
  const { action, content, ...options } = req.body;
  const validActions = ['improve', 'rewrite', 'continue', 'expand', 'shorten', 'translate', 'explain'];
  if (!validActions.includes(action)) throw new AppError('Invalid action', 400);
  const result = await aiAction(req.user?._id, action, content, options);
  res.json({ success: true, data: result });
});

export const reviewContent = asyncHandler(async (req, res) => {
  const review = await aiReview(req.body.content);
  res.json({ success: true, data: review });
});

export const getAIHistory = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  const total = await AIHistory.countDocuments(filter);
  const { query, page, limit } = paginate(AIHistory.find(filter), req.query.page, req.query.limit);
  const data = await query.sort({ createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const getAIStats = asyncHandler(async (req, res) => {
  const stats = await AIHistory.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        totalTokens: { $sum: '$tokensUsed' },
        types: { $push: '$type' },
      },
    },
  ]);
  res.json({ success: true, data: stats[0] || { totalRequests: 0, totalTokens: 0 } });
});
