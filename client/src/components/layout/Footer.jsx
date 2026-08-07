import { Link } from 'react-router-dom';
import { Heart, Twitter, Instagram, Github, Mail } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const footerLinks = {
  Platform: [
    { to: '/explore', label: 'Explore' },
    { to: '/ai-studio', label: 'AI Studio' },
    { to: '/community', label: 'Community' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/pricing', label: 'Premium Plans' },
  ],
  Resources: [
    { to: '/publish', label: 'Publish' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
  ],
  Legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold gradient-text">KavyaKosh</span>
            </div>
            <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              The world's most advanced AI literary platform. Create, publish, discover, and celebrate the art of poetry.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 KavyaKosh. Made with <Heart size={14} className="inline text-[var(--color-primary)]" /> for poets everywhere.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
