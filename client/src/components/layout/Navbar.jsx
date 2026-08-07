import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Bell, ShoppingCart, User, LogOut,
  Home, Compass, Sparkles, Users, BookOpen, PenTool, LayoutDashboard, Shield
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { Avatar } from '../ui';
import { logoutUser } from '../../features/auth/authSlice';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/ai-studio', label: 'AI Studio', icon: Sparkles },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/marketplace', label: 'Marketplace', icon: BookOpen },
  { to: '/publish', label: 'Publish', icon: PenTool },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { unread } = useSelector((s) => s.notifications);
  const cartCount = useSelector((s) => s.cart.count);

  const handleLogout = () => dispatch(logoutUser());

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">KavyaKosh</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to ? 'text-[var(--color-primary)]' : 'hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
              <Search size={20} />
            </button>
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link to="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-[var(--bg-card)]">
                  <Bell size={20} />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Link>
                <Link to="/marketplace/cart" className="relative p-2 rounded-lg hover:bg-[var(--bg-card)]">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-card)]">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 8px 30px var(--shadow-color)' }}>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--bg-secondary)]">
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--bg-secondary)] w-full text-left text-red-500">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-card)]">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-4">
              <input type="text" placeholder="Search poetry, books, authors..." className="input-field" autoFocus />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden overflow-hidden border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-card)]">
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
