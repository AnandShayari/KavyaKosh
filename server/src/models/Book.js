import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: String,
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publisher: String,
    isbn: String,
    coverImage: { type: String, required: true },
    category: { type: String, required: true },
    genres: [String],
    language: { type: String, default: 'hindi' },
    format: { type: String, enum: ['ebook', 'audiobook', 'physical', 'all'], default: 'ebook' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: Number,
    pages: Number,
    samplePages: String,
    pdfUrl: String,
    audioUrl: String,
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    tags: [String],
    status: { type: String, enum: ['draft', 'published', 'out_of_stock'], default: 'published' },
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', description: 'text', tags: 'text' });
bookSchema.index({ category: 1, genre: 1, price: 1 });

export default mongoose.model('Book', bookSchema);
