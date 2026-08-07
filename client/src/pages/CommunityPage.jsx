import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Share2, Hash, Trophy, Plus, TrendingUp } from 'lucide-react';
import { Card, Avatar, Badge, Button, Skeleton, EmptyState } from '../components/ui';
import api from '../services/api';
import { useSelector } from 'react-redux';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    Promise.all([
      api.get('/community/posts').then((r) => setPosts(r.data.data)).catch(() => {}),
      api.get('/community/trending-hashtags').then((r) => setHashtags(r.data.data)).catch(() => {}),
      api.get('/community/leaderboard').then((r) => setLeaderboard(r.data.data)).catch(() => {}),
      api.get('/community/communities').then((r) => setCommunities(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      const { data } = await api.post('/community/posts', { content: newPost, hashtags: newPost.match(/#\w+/g)?.map((h) => h.slice(1)) || [] });
      setPosts([data.data, ...posts]);
      setNewPost('');
    } catch { /* empty */ }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/community/posts/${postId}/like`);
      setPosts(posts.map((p) => p._id === postId ? { ...p, likes: p.likes?.includes(user?.id) ? p.likes.filter((l) => l !== user?.id) : [...(p.likes || []), user?.id] } : p));
    } catch { /* empty */ }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Users className="text-[var(--color-primary)]" /> Community</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Connect with poets, share your work, and grow together</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isAuthenticated && (
            <Card>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts, poetry, or use #hashtags..."
                className="input-field min-h-[100px] resize-none mb-4"
              />
              <div className="flex justify-end">
                <Button onClick={handlePost} className="flex items-center gap-2"><Plus size={16} /> Post</Button>
              </div>
            </Card>
          )}

          {loading ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />) :
            posts.length === 0 ? <EmptyState icon={Users} title="No posts yet" description="Be the first to share something!" /> :
            posts.map((post, i) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar src={post.author?.avatar} name={post.author?.name} />
                    <div>
                      <p className="font-medium">{post.author?.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    {post.isPinned && <Badge variant="gold">Pinned</Badge>}
                  </div>
                  <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                  {post.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((tag) => <Badge key={tag}>#{tag}</Badge>)}
                    </div>
                  )}
                  <div className="flex items-center gap-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)] transition-colors">
                      <Heart size={16} /> {post.likes?.length || 0}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)] transition-colors">
                      <MessageCircle size={16} /> Comment
                    </button>
                    <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)] transition-colors">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Hash size={18} /> Trending</h3>
            <div className="space-y-2">
              {hashtags.map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-primary)]">#{tag}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{count} posts</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Trophy size={18} /> Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((user, i) => (
                <div key={user._id} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-6" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.writingStreak} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Users size={18} /> Communities</h3>
            <div className="space-y-3">
              {communities.map((c) => (
                <div key={c._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.memberCount} members</p>
                  </div>
                  <Button variant="ghost" className="text-xs !px-3 !py-1">Join</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
