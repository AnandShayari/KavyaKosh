import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Save, Send, Eye, Globe, Users, Sparkles } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import api from '../services/api';

export default function PublishPage() {
  const [form, setForm] = useState({
    title: '', content: '', type: 'shayari', language: 'hindi', mood: '', tags: '', visibility: 'public', status: 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (status) => {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage('Please add a title and some content before publishing.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
      };
      const { data } = await api.post('/poetry', payload);
      setMessage(status === 'published' ? 'Your work is now live.' : 'Draft saved successfully.');
      navigate(`/poetry/${data.data._id}`);
    } catch {
      setMessage('Something went wrong while saving your work.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><PenTool className="text-[var(--color-primary)]" /> Publish</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Share your poetry with the world</p>

      <Card>
        <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Sparkles size={16} className="text-[var(--color-primary)]" />
          Write, polish, and publish your next piece in a few clicks.
        </div>
        <div className="space-y-6">
          <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Give your work a title" />

          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Content</label>
            <textarea
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Write your poetry here... Supports markdown."
              className="input-field min-h-[300px] resize-y poetry-text text-lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={form.type} onChange={(e) => update('type', e.target.value)} className="input-field text-sm">
                {['shayari', 'ghazal', 'poem', 'nazm', 'quote', 'haiku'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Language</label>
              <select value={form.language} onChange={(e) => update('language', e.target.value)} className="input-field text-sm">
                {['hindi', 'urdu', 'english'].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Mood</label>
              <input value={form.mood} onChange={(e) => update('mood', e.target.value)} className="input-field text-sm" placeholder="e.g. romantic" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Tags</label>
              <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="input-field text-sm" placeholder="love, nature" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Visibility</label>
            <div className="flex gap-3">
              {[
                { value: 'public', icon: Globe, label: 'Public' },
                { value: 'followers', icon: Users, label: 'Followers' },
                { value: 'private', icon: Eye, label: 'Private' },
              ].map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => update('visibility', value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${form.visibility === value ? 'gradient-bg text-white' : 'btn-secondary'}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>

          {message && <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{message}</div>}

          <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={saving} className="flex items-center gap-2">
              <Save size={16} /> Save Draft
            </Button>
            <Button onClick={() => handleSubmit('published')} disabled={saving} className="flex items-center gap-2">
              <Send size={16} /> {saving ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
