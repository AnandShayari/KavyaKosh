import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Sparkles, ShoppingBag, BookOpen, Bookmark } from 'lucide-react';
import { Card } from '../../components/ui';
import api from '../../services/api';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({ poetry: 0, orders: 0, aiRequests: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/poetry/my').then((r) => setStats((s) => ({ ...s, poetry: r.data.pagination?.total || 0 }))).catch(() => {}),
      api.get('/books/orders').then((r) => setStats((s) => ({ ...s, orders: r.data.pagination?.total || 0 }))).catch(() => {}),
      api.get('/ai/stats').then((r) => setStats((s) => ({ ...s, aiRequests: r.data.data?.totalRequests || 0 }))).catch(() => {}),
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Published Works', value: stats.poetry, icon: PenTool, color: 'var(--color-primary)' },
          { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'var(--color-gold)' },
          { label: 'AI Generations', value: stats.aiRequests, icon: Sparkles, color: 'var(--color-secondary)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/ai-studio', label: 'AI Studio', icon: Sparkles },
            { to: '/publish', label: 'Publish', icon: PenTool },
            { to: '/marketplace', label: 'Browse Books', icon: BookOpen },
            { to: '/explore', label: 'Explore', icon: Bookmark },
          ].map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
              <Icon size={24} className="text-[var(--color-primary)]" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
