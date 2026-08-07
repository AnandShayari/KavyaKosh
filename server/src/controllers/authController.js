import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/tokens.js';
import { sendOTPEmail, sendResetEmail } from '../services/emailService.js';

const defaultAdmin = {
  email: 'admin@kavyakosh.com',
  password: 'admin123',
};

const trackLoginActivity = async (user, req) => {
  user.lastLoginAt = new Date();
  user.lastLoginIp = req.ip;
  await user.save({ validateBeforeSave: false });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 400);

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await trackLoginActivity(user, req);

  setTokenCookies(res, accessToken, refreshToken);
  res.status(201).json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.toLowerCase();
  const isDefaultAdminLogin = normalizedEmail === defaultAdmin.email && password === defaultAdmin.password;
  let user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user && isDefaultAdminLogin) {
    user = await User.create({
      name: 'Admin',
      email: defaultAdmin.email,
      password: defaultAdmin.password,
      role: 'admin',
      isVerified: true,
      isEmailVerified: true,
      bio: 'KavyaKosh Platform Administrator',
    });
    user = await User.findById(user._id).select('+password');
  }

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (isDefaultAdminLogin && user.role !== 'admin') {
    user.role = 'admin';
    user.isVerified = true;
    user.isEmailVerified = true;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await trackLoginActivity(user, req);

  setTokenCookies(res, accessToken, refreshToken);
  res.json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  clearTokenCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);

  const decoded = jwt.verify(token, config.jwt.refreshSecret);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401);

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  await trackLoginActivity(user, req);

  setTokenCookies(res, accessToken, newRefreshToken);
  res.json({ success: true, data: { accessToken } });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken -resetPasswordToken -otp');
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'avatar', 'coverImage', 'preferences'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: email.split('@')[0], email, oauthProvider: 'local' });
  }
  user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  await user.save({ validateBeforeSave: false });
  await sendOTPEmail(email, otp);
  res.json({ success: true, message: 'OTP sent to email' });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp?.code !== otp || user.otp?.expiresAt < new Date()) {
    throw new AppError('Invalid or expired OTP', 400);
  }
  user.isEmailVerified = true;
  user.otp = undefined;
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  await trackLoginActivity(user, req);
  setTokenCookies(res, accessToken, refreshToken);
  res.json({ success: true, data: { user, accessToken } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: true, message: 'If email exists, reset link sent' });
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });
  await sendResetEmail(user.email, resetToken);
  res.json({ success: true, message: 'Reset link sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new AppError('Invalid or expired token', 400);
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

export const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user._id.toString()) throw new AppError('Cannot follow yourself', 400);
  const target = await User.findById(targetId);
  if (!target) throw new AppError('User not found', 404);

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user._id } });
  res.json({ success: true, message: 'Followed' });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  await User.findByIdAndUpdate(req.user._id, { $pull: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { followers: req.user._id } });
  res.json({ success: true, message: 'Unfollowed' });
});
