import mongoose from 'mongoose';

const poetrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['shayari', 'ghazal', 'poem', 'nazm', 'quote', 'haiku', 'caption', 'story', 'lyrics'],
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    language: { type: String, enum: ['hindi', 'urdu', 'english', 'mixed'], default: 'hindi' },
    mood: { type: String, default: '' },
    genre: { type: String, default: '' },
    tags: [String],
    coverImage: String,
    audioUrl: String,
    videoUrl: String,
    visibility: { type: String, enum: ['public', 'private', 'followers'], default: 'public' },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    scheduledAt: Date,
    isAIGenerated: { type: Boolean, default: false },
    aiPrompt: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    scores: {
      emotion: Number,
      creativity: Number,
      grammar: Number,
      rhythm: Number,
      imagery: Number,
    },
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

poetrySchema.index({ title: 'text', content: 'text', tags: 'text' });
poetrySchema.index({ type: 1, language: 1, mood: 1 });
poetrySchema.index({ author: 1, status: 1 });

export default mongoose.model('Poetry', poetrySchema);
