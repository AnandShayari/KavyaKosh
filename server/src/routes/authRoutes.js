import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import passport from '../config/passport.js';
import * as auth from '../controllers/authController.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies } from '../utils/tokens.js';
import config from '../config/index.js';

const router = Router();

const oauthCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${config.clientUrl}/auth/callback?token=${accessToken}`);
  } catch {
    res.redirect(`${config.clientUrl}/login?error=oauth_failed`);
  }
};

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  validate,
], auth.register);

router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').notEmpty(),
  validate,
], auth.login);

router.post('/logout', protect, auth.logout);
router.post('/refresh', auth.refreshToken);
router.get('/me', protect, auth.getMe);
router.put('/profile', protect, auth.updateProfile);
router.post('/otp/send', authLimiter, [body('email').isEmail(), validate], auth.sendOTP);
router.post('/otp/verify', [body('email').isEmail(), body('otp').notEmpty(), validate], auth.verifyOTP);
router.post('/forgot-password', authLimiter, [body('email').isEmail(), validate], auth.forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 6 }), validate], auth.resetPassword);
router.post('/follow/:id', protect, auth.followUser);
router.delete('/follow/:id', protect, auth.unfollowUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${config.clientUrl}/login?error=oauth_failed` }), oauthCallback);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: `${config.clientUrl}/login?error=oauth_failed` }), oauthCallback);

export default router;
