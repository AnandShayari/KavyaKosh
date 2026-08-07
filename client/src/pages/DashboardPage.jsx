import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, BookOpen, Heart, Bookmark, ShoppingBag, Sparkles,
  Bell, Settings, Trophy, User, PenTool
} from 'lucide-react';
import { Avatar, Card } from '../components/ui';

const sidebarLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/dashboard/published', label: 'Published Works', icon: PenTool },
  { to: '/dashboard/ai-history', label: 'AI History', icon: Sparkles },
  { to: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <Card className="text-center !p-6">
            <Avatar src={user?.avatar} name={user?.name} size="lg" className="mx-auto" />
            <h2 className="font-semibold mt-3">{user?.name}</h2>
            <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
            {user?.writingStreak > 0 && (
              <p className="text-xs mt-2 text-[var(--color-gold)]">{user.writingStreak} day streak 🔥</p>
            )}
          </Card>
          <nav className="space-y-1">
            {sidebarLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  location.pathname === to ? 'gradient-bg text-white' : 'hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({ poetry: 0, orders: 0, aiRequests: 0 });

  useEffect(() => {
    Promise.all([
      import('../services/api').then(({ default: api }) => api.get('/poetry/my').then((r) => setStats((s) => ({ ...s, poetry: r.data.pagination?.total || 0 })))),
      import('../services/api').then(({ default: api }) => api.get('/books/orders').then((r) => setStats((s) => ({ ...s, orders: r.data.pagination?.total || 0 })))),
      import('../services/api').then(({ default: api }) => api.get('/ai/stats').then((r) => setStats((s) => ({ ...s, aiRequests: r.data.data?.totalRequests || 0 })))),
    ]).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name?.split(' ')[0]}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Published Works', value: stats.poetry, icon: PenTool, color: 'var(--color-primary)' },
          { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'var(--color-gold)' },
          { label: 'AI Generations', value: stats.aiRequests, icon: Sparkles, color: 'var(--color-secondary)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
              <Icon size={24} style={{ color }} />
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
