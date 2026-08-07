import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Copy, Download, RefreshCw, Wand2, Languages, BookOpen,
  Volume2, Share2, Save, Send, ChevronDown, Loader2
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import api from '../services/api';

const POETRY_TYPES = [
  'shayari', 'ghazal', 'poem', 'nazm', 'quote', 'haiku', 'caption', 'story', 'lyrics',
  'wedding shayari', 'love shayari', 'sad shayari', 'romantic shayari', 'friendship shayari',
  'motivational shayari', 'urdu poetry', 'hindi poetry', 'english poetry',
];

const MOODS = ['romantic', 'sad', 'happy', 'motivational', 'spiritual', 'patriotic', 'funny', 'mysterious'];
const LANGUAGES = ['hindi', 'urdu', 'english', 'mixed'];
const STYLES = ['classical', 'modern', 'ghazal', 'free verse', 'rhyming', 'experimental'];
const TONES = ['formal', 'casual', 'dramatic', 'melancholic', 'uplifting', 'intimate'];

export default function AIStudioPage() {
  const [type, setType] = useState('shayari');
  const [language, setLanguage] = useState('hindi');
  const [mood, setMood] = useState('romantic');
  const [style, setStyle] = useState('classical');
  const [tone, setTone] = useState('intimate');
  const [creativity, setCreativity] = useState(3);
  const [length, setLength] = useState(3);
  const [keywords, setKeywords] = useState('');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const outputRef = useRef(null);

  const generate = useCallback(async () => {
    setStreaming(true);
    setOutput('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify({ type, language, mood, style, tone, creativity, length, keywords, prompt }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setOutput(`Error: ${err.message || `Server error ${response.status}`}`);
        setStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                text += parsed.content;
                setOutput(text);
              }
              if (parsed.error) setOutput(`Error: ${parsed.error}`);
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    } catch (err) {
      setOutput(`Failed to generate: ${err.message}`);
    }
    setStreaming(false);
  }, [type, language, mood, style, tone, creativity, length, keywords, prompt]);

  const performAction = async (action) => {
    if (!output) return;
    setStreaming(true);
    try {
      const { data } = await api.post('/ai/action', { action, content: output, type, language });
      setOutput(data.data.result);
    } catch {
      setOutput((prev) => prev + '\n\n[Action failed]');
    }
    setStreaming(false);
  };

  const copyToClipboard = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold flex items-center justify-center gap-3">
          <Sparkles className="text-[var(--color-primary)]" /> AI Studio
        </motion.h1>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Create literary masterpieces with AI-powered generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className={`lg:col-span-4 space-y-4 ${showControls ? '' : 'hidden lg:block'}`}>
          <Card>
            <h3 className="font-semibold mb-4">Poetry Type</h3>
            <div className="flex flex-wrap gap-2">
              {POETRY_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    type === t ? 'gradient-bg text-white' : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                  style={type !== t ? { border: '1px solid var(--border-color)' } : {}}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">AI Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Language</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANGUAGES.map((l) => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-lg text-xs capitalize ${language === l ? 'gradient-bg text-white' : ''}`}
                      style={language !== l ? { border: '1px solid var(--border-color)' } : {}}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Mood</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MOODS.map((m) => (
                    <button key={m} onClick={() => setMood(m)} className={`px-3 py-1 rounded-lg text-xs capitalize ${mood === m ? 'gradient-bg text-white' : ''}`}
                      style={mood !== m ? { border: '1px solid var(--border-color)' } : {}}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field mt-1 text-sm">
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field mt-1 text-sm">
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium flex justify-between" style={{ color: 'var(--text-muted)' }}>
                  Creativity <span>{creativity}/5</span>
                </label>
                <input type="range" min="1" max="5" value={creativity} onChange={(e) => setCreativity(+e.target.value)} className="w-full mt-1 accent-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-xs font-medium flex justify-between" style={{ color: 'var(--text-muted)' }}>
                  Length <span>{length}/5</span>
                </label>
                <input type="range" min="1" max="5" value={length} onChange={(e) => setLength(+e.target.value)} className="w-full mt-1 accent-[var(--color-primary)]" />
              </div>
              <input type="text" placeholder="Keywords (optional)" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="input-field text-sm" />
              <textarea placeholder="Custom prompt (optional)" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input-field text-sm min-h-[80px] resize-none" rows={3} />
            </div>
          </Card>

          <Button onClick={generate} disabled={streaming} className="w-full flex items-center justify-center gap-2">
            {streaming ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {streaming ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          <Card className="min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <Badge>{type}</Badge>
                <Badge variant="gold">{language}</Badge>
                {mood && <Badge variant="success">{mood}</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {[
                  { icon: Copy, action: copyToClipboard, label: 'Copy' },
                  { icon: RefreshCw, action: generate, label: 'Regenerate' },
                  { icon: Wand2, action: () => performAction('improve'), label: 'Improve' },
                  { icon: Languages, action: () => performAction('translate'), label: 'Translate' },
                  { icon: BookOpen, action: () => performAction('explain'), label: 'Explain' },
                  { icon: Volume2, action: () => {}, label: 'Read' },
                  { icon: Share2, action: () => {}, label: 'Share' },
                  { icon: Save, action: () => {}, label: 'Save' },
                  { icon: Send, action: () => {}, label: 'Publish' },
                ].map(({ icon: Icon, action, label }) => (
                  <button key={label} onClick={action} title={label} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" disabled={streaming}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div ref={outputRef} className="flex-1 overflow-y-auto">
              {output ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-lg leading-relaxed poetry-text">
                  {output}
                  {streaming && <span className="inline-block w-2 h-5 bg-[var(--color-primary)] animate-pulse ml-1" />}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20" style={{ color: 'var(--text-muted)' }}>
                  <Sparkles size={48} className="mb-4 opacity-20" />
                  <p>Your generated poetry will appear here</p>
                  <p className="text-sm mt-1">Select options and click Generate to start</p>
                </div>
              )}
            </div>

            {output && !streaming && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                {['improve', 'rewrite', 'continue', 'expand', 'shorten'].map((action) => (
                  <button key={action} onClick={() => performAction(action)} className="px-3 py-1.5 rounded-lg text-xs capitalize hover:bg-[var(--bg-secondary)] transition-colors"
                    style={{ border: '1px solid var(--border-color)' }}>
                    {action}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
