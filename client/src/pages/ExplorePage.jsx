import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Bookmark, Eye } from 'lucide-react';
import { Card, Badge, Avatar, Skeleton, EmptyState } from '../components/ui';
import api from '../services/api';

const FILTERS = {
  type: ['shayari', 'ghazal', 'poem', 'nazm', 'quote', 'haiku'],
  language: ['hindi', 'urdu', 'english'],
  mood: ['romantic', 'sad', 'happy', 'motivational', 'spiritual'],
};

export default function ExplorePage() {
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchPoetry = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 12, ...filters };
      if (search) params.search = search;
      const { data } = await api.get('/poetry', { params });
      setPoetry(append ? (prev) => [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasNext);
    } catch { /* empty */ }
    setLoading(false);
  }, [filters, search]);

  useEffect(() => { fetchPoetry(1); setPage(1); }, [filters, search]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPoetry(next, true);
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Explore</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Discover poetry, shayari, ghazals, and more</p>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search poetry, authors, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
          <Filter size={18} /> Filters
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8">
          <Card>
            {Object.entries(FILTERS).map(([key, values]) => (
              <div key={key} className="mb-4 last:mb-0">
                <p className="text-sm font-medium mb-2 capitalize">{key}</p>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => (
                    <button
                      key={v}
                      onClick={() => toggleFilter(key, v)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                        filters[key] === v ? 'gradient-bg text-white' : ''
                      }`}
                      style={filters[key] !== v ? { border: '1px solid var(--border-color)' } : {}}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      )}

      {poetry.length === 0 && !loading ? (
        <EmptyState icon={Search} title="No poetry found" description="Try adjusting your filters or search terms" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poetry.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/poetry/${item._id}`}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={item.author?.avatar} name={item.author?.name} />
                    <div>
                      <p className="font-medium text-sm">{item.author?.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        <Badge>{item.type}</Badge>
                        <Badge variant="gold">{item.language}</Badge>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm poetry-text line-clamp-4 mb-4">{item.content}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {item.likes?.length || 0}</span>
                    <span className="flex items-center gap-1"><Bookmark size={12} /> {item.bookmarks?.length || 0}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
          {loading && [...Array(3)].map((_, i) => <Skeleton key={`sk-${i}`} className="h-56" />)}
        </div>
      )}

      {hasMore && !loading && poetry.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={loadMore} className="btn-secondary">Load More</button>
        </div>
      )}
    </div>
  );
}
