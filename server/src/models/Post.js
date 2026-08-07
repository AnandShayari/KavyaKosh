import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    poetry: { type: mongoose.Schema.Types.ObjectId, ref: 'Poetry' },
    coverImage: String,
    hashtags: [String],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    poll: {
      question: String,
      options: [{ text: String, votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }],
      endsAt: Date,
    },
    isPinned: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    reports: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, reason: String, createdAt: Date }],
    moderationStatus: { type: String, enum: ['approved', 'pending', 'flagged', 'removed'], default: 'approved' },
  },
  { timestamps: true }
);

postSchema.index({ content: 'text', hashtags: 'text' });

export default mongoose.model('Post', postSchema);
