import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    poetry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poetry' }],
  },
  { timestamps: true }
);

export default mongoose.model('Wishlist', wishlistSchema);
