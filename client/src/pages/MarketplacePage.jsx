import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, ShoppingCart, Heart, Search, Filter, TrendingUp } from 'lucide-react';
import { Card, Badge, Skeleton, EmptyState, Button } from '../components/ui';
import { formatPrice } from '../lib/utils';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setCart } from '../features/cart/cartSlice';

export default function MarketplacePage() {
  const [books, setBooks] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([
      api.get('/books', { params: { search, category } }).then((r) => setBooks(r.data.data)).catch(() => {}),
      api.get('/books/bestsellers').then((r) => setBestsellers(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [search, category]);

  const addToCart = async (bookId) => {
    try {
      const { data } = await api.post('/books/cart', { bookId });
      dispatch(setCart(data.data));
    } catch { /* empty */ }
  };

  const toggleWishlist = async (bookId) => {
    try { await api.post('/books/wishlist', { bookId }); } catch { /* empty */ }
  };

  const categories = ['Poetry', 'Shayari', 'Ghazal', 'Fiction', 'Non-Fiction', 'Biography'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><BookOpen className="text-[var(--color-primary)]" /> Marketplace</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Discover and purchase literary masterpieces</p>

      {bestsellers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} /> Bestsellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bestsellers.slice(0, 6).map((book) => (
              <Link key={book._id} to={`/marketplace/${book._id}`}>
                <Card hover className="!p-0 overflow-hidden text-center">
                  <img src={book.coverImage} alt={book.title} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-medium line-clamp-1">{book.title}</p>
                    <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{formatPrice(book.discountPrice || book.price)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${!category ? 'gradient-bg text-white' : 'btn-secondary'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${category === c ? 'gradient-bg text-white' : 'btn-secondary'}`}>{c}</button>
          ))}
        </div>
      </div>

      {books.length === 0 && !loading ? (
        <EmptyState icon={BookOpen} title="No books found" description="Try a different search or category" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? [...Array(8)].map((_, i) => <Skeleton key={i} className="h-72" />) :
            books.map((book, i) => (
              <motion.div key={book._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="!p-0 overflow-hidden h-full flex flex-col">
                  <Link to={`/marketplace/${book._id}`}>
                    <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link to={`/marketplace/${book._id}`}>
                      <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{book.author?.name}</p>
                    </Link>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={14} className="text-[var(--color-gold)] fill-[var(--color-gold)]" />
                      <span className="text-xs">{book.rating} ({book.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-3">
                      <span className="font-bold text-[var(--color-primary)]">{formatPrice(book.discountPrice || book.price)}</span>
                      {book.discountPrice && <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>{formatPrice(book.price)}</span>}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => addToCart(book._id)} className="btn-primary flex-1 text-xs !py-2 flex items-center justify-center gap-1">
                        <ShoppingCart size={14} /> Add
                      </button>
                      <button onClick={() => toggleWishlist(book._id)} className="btn-secondary !p-2">
                        <Heart size={14} />
                      </button>
                    </div>
                    {book.bestseller && <Badge variant="gold" className="mt-2 self-start">Bestseller</Badge>}
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
