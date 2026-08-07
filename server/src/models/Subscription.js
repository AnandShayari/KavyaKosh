import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['student', 'creator', 'enterprise'], required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    amount: Number,
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, enum: ['razorpay', 'stripe'] },
    paymentId: String,
    status: { type: String, enum: ['active', 'cancelled', 'expired', 'past_due'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
