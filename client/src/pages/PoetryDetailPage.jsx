import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Bookmark, Share2, Eye, Sparkles } from 'lucide-react';
import { Card, Avatar, Badge, Skeleton, Button } from '../components/ui';
import api from '../services/api';

export default function PoetryDetailPage() {
  const { id } = useParams();
  const [poetry, setPoetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);

  useEffect(() => {
    api.get(`/poetry/${id}`).then((r) => setPoetry(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAIReview = async () => {
    try {
      const { data } = await api.post('/ai/review', { content: poetry.content });
      setReview(data.data);
    } catch { /* empty */ }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><Skeleton className="h-96" /></div>;
  if (!poetry) return <div className="text-center py-20">Poetry not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={poetry.author?.avatar} name={poetry.author?.name} size="lg" />
          <div>
            <h2 className="font-semibold text-lg">{poetry.author?.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge>{poetry.type}</Badge>
              <Badge variant="gold">{poetry.language}</Badge>
              {poetry.mood && <Badge variant="success">{poetry.mood}</Badge>}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 font-serif">{poetry.title}</h1>
        <div className="text-xl leading-relaxed poetry-text whitespace-pre-wrap mb-8">{poetry.content}</div>

        <div className="flex items-center gap-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <span className="flex items-center gap-1.5 text-sm"><Eye size={16} /> {poetry.views}</span>
          <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)]"><Heart size={16} /> {poetry.likes?.length || 0}</button>
          <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)]"><Bookmark size={16} /> Save</button>
          <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)]"><Share2 size={16} /> Share</button>
          <Button variant="ghost" onClick={handleAIReview} className="ml-auto flex items-center gap-1.5 text-sm">
            <Sparkles size={16} /> AI Review
          </Button>
        </div>
      </Card>

      {review && (
        <Card className="mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles size={18} /> AI Review</h3>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {['emotion', 'creativity', 'grammar', 'rhythm', 'imagery'].map((key) => (
              <div key={key} className="text-center">
                <p className="text-2xl font-bold text-[var(--color-primary)]">{review.scores?.[key] || review[key] || '-'}</p>
                <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{key}</p>
              </div>
            ))}
          </div>
          {review.summary && <p className="text-sm mb-4">{review.summary}</p>}
          {review.suggestions && (
            <ul className="space-y-1">
              {review.suggestions.map((s, i) => <li key={i} className="text-sm flex items-start gap-2"><span className="text-[var(--color-primary)]">•</span>{s}</li>)}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
