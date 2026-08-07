import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    role: {
      type: String,
      enum: ['reader', 'author', 'moderator', 'admin'],
      default: 'reader',
    },
    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    oauthProvider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
    oauthId: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    badges: [{ name: String, icon: String, earnedAt: Date }],
    writingStreak: { type: Number, default: 0 },
    lastActiveDate: Date,
    subscription: {
      plan: { type: String, enum: ['free', 'student', 'creator', 'enterprise'], default: 'free' },
      status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
      expiresAt: Date,
      stripeCustomerId: String,
      razorpayCustomerId: String,
    },
    preferences: {
      language: { type: String, default: 'hindi' },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
      notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    },
    refreshToken: { type: String, select: false },
    lastLoginAt: Date,
    lastLoginIp: String,
    otp: { code: String, expiresAt: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    apiUsage: { tokensUsed: { type: Number, default: 0 }, requests: { type: Number, default: 0 } },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ name: 'text', bio: 'text' });

export default mongoose.model('User', userSchema);
