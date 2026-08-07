import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  format: { type: String, enum: ['ebook', 'audiobook', 'physical'], default: 'ebook' },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
