import Book from '../models/Book.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { paginate, paginateResponse, buildSort, buildFilter } from '../utils/pagination.js';

export const getBooks = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  filter.status = 'published';
  if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
  if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
  const sort = buildSort(req.query.sortBy || 'createdAt', req.query.order);
  const total = await Book.countDocuments(filter);
  const { query, page, limit } = paginate(
    Book.find(filter).populate('author', 'name avatar'),
    req.query.page,
    req.query.limit
  );
  const data = await query.sort(sort);
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author', 'name avatar bio');
  if (!book) throw new AppError('Book not found', 404);
  res.json({ success: true, data: book });
});

export const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: book });
});

export const getFeaturedBooks = asyncHandler(async (req, res) => {
  const data = await Book.find({ featured: true, status: 'published' }).limit(8).populate('author', 'name avatar');
  res.json({ success: true, data });
});

export const getBestsellers = asyncHandler(async (req, res) => {
  const data = await Book.find({ bestseller: true }).sort({ sales: -1 }).limit(12).populate('author', 'name avatar');
  res.json({ success: true, data });
});

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { bookId, quantity = 1, format = 'ebook' } = req.body;
  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Book not found', 404);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.book.toString() === bookId && i.format === format);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ book: bookId, quantity, format });

  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.book');
  res.json({ success: true, data: cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, data: cart });
});

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('books poetry');
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, books: [], poetry: [] });
  res.json({ success: true, data: wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, books: [] });

  const idx = wishlist.books.indexOf(bookId);
  if (idx > -1) wishlist.books.splice(idx, 1);
  else wishlist.books.push(bookId);
  await wishlist.save();
  res.json({ success: true, data: { wishlisted: idx === -1 } });
});

export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
  if (!cart?.items.length) throw new AppError('Cart is empty', 400);

  let subtotal = 0;
  const items = cart.items.map((item) => {
    const price = item.book.discountPrice || item.book.price;
    subtotal += price * item.quantity;
    return {
      book: item.book._id,
      title: item.book.title,
      coverImage: item.book.coverImage,
      price,
      quantity: item.quantity,
      format: item.format,
    };
  });

  let discount = 0;
  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase(), isActive: true });
    if (coupon && coupon.validUntil > new Date()) {
      discount = coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    paymentMethod: req.body.paymentMethod || 'razorpay',
    shippingAddress: req.body.shippingAddress,
    paymentStatus: req.body.paymentMethod === 'free' ? 'paid' : 'pending',
    status: 'confirmed',
  });

  cart.items = [];
  await cart.save();

  for (const item of items) {
    await Book.findByIdAndUpdate(item.book, { $inc: { sales: item.quantity } });
  }

  res.status(201).json({ success: true, data: order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const total = await Order.countDocuments(filter);
  const { query, page, limit } = paginate(Order.find(filter).populate('user', 'name email'), req.query.page, req.query.limit);
  const data = await query.sort({ createdAt: -1 });
  res.json({ success: true, ...paginateResponse(data, total, page, limit) });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404);
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }
  res.json({ success: true, data: order });
});
