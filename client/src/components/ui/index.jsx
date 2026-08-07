import { cn } from '../../lib/utils';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'px-4 py-2 rounded-xl hover:bg-[var(--bg-card)] transition-colors',
    danger: 'px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors',
  };
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</label>}
      <input className={cn('input-field', error && 'border-red-500', className)} {...props} />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn('rounded-2xl p-6', hover && 'card-hover cursor-pointer', className)}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
    gold: 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]',
    success: 'bg-green-500/10 text-green-500',
  };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={cn('skeleton', className)} />;
}

export function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return src ? (
    <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
  ) : (
    <div className={cn('rounded-full gradient-bg flex items-center justify-center text-white font-medium', sizes[size])}>
      {initials}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={48} className="mb-4 opacity-30" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>{description}</p>
      {action}
    </div>
  );
}
