import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    coverImage: String,
    avatar: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: String,
    isPrivate: { type: Boolean, default: false },
    rules: [String],
    memberCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Community', communitySchema);
