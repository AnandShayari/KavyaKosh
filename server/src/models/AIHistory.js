import mongoose from 'mongoose';

const aiHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    type: { type: String, required: true },
    language: String,
    mood: String,
    style: String,
    tokensUsed: { type: Number, default: 0 },
    model: { type: String, default: 'gpt-4o-mini' },
    action: { type: String, enum: ['generate', 'improve', 'rewrite', 'continue', 'expand', 'shorten', 'translate', 'explain'], default: 'generate' },
    savedAsPoetry: { type: mongoose.Schema.Types.ObjectId, ref: 'Poetry' },
  },
  { timestamps: true }
);

export default mongoose.model('AIHistory', aiHistorySchema);
