import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    poetry: { type: mongoose.Schema.Types.ObjectId, ref: 'Poetry' },
    rating: { type: Number, min: 1, max: 5 },
    content: String,
    isAIReview: { type: Boolean, default: false },
    scores: {
      emotion: Number,
      creativity: Number,
      grammar: Number,
      rhythm: Number,
      imagery: Number,
    },
    suggestions: [String],
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
