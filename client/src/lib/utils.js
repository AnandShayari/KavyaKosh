export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(date));
}

export function truncate(str, len = 100) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function getInitials(name) {
  return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}
