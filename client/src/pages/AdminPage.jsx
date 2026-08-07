import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  BadgeIndianRupee,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  ImagePlus,
  LayoutDashboard,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Trash2,
  Upload,
  Users,
  XCircle,
} from 'lucide-react';
import { Avatar, Badge, Button, Card, EmptyState, Input, Skeleton } from '../components/ui';
import { formatDate, formatPrice } from '../lib/utils';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement);

const emptyBook = {
  title: '',
  subtitle: '',
  description: '',
  coverImage: '',
  category: 'Poetry',
  price: '',
  discountPrice: '',
  format: 'ebook',
  language: 'hindi',
  stock: 50,
  publisher: 'KavyaKosh',
  isbn: '',
  pages: 120,
  featured: true,
  bestseller: false,
  newArrival: true,
  tags: '',
};

const categories = ['Poetry', 'Shayari', 'Ghazal', 'Fiction', 'Non-Fiction', 'Biography'];
const roleOptions = ['reader', 'author', 'moderator', 'admin'];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#8c94b6' } } },
  scales: {
    x: { ticks: { color: '#8c94b6' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#8c94b6' }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

const recentlyLoggedIn = (date) => {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 1000 * 60 * 60 * 24 * 7;
};

export default function AdminPage() {
  const fileRef = useRef(null);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookSaving, setBookSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [bookForm, setBookForm] = useState(emptyBook);

  const loadData = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setRefreshing(true);
    try {
      const [dashboardRes, analyticsRes, usersRes, booksRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/analytics'),
        api.get('/admin/users', { params: { limit: 50 } }),
        api.get('/admin/books', { params: { limit: 8 } }),
      ]);
      setDashboard(dashboardRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setUsers(usersRes.data.data || []);
      setBooks(booksRes.data.data || []);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Could not load admin data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const text = `${user.name} ${user.email}`.toLowerCase();
    const matchesSearch = text.includes(userSearch.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }), [roleFilter, userSearch, users]);

  const loggedInUsers = useMemo(
    () => filteredUsers.filter((user) => user.lastLoginAt),
    [filteredUsers]
  );

  const stats = dashboard?.stats || {};
  const activeUsers = users.filter((user) => user.isActive).length;
  const recentLogins = users.filter((user) => recentlyLoggedIn(user.lastLoginAt)).length;

  const updateBookField = (field, value) => {
    setBookForm((current) => ({ ...current, [field]: value }));
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('cover', file);
    setCoverUploading(true);
    setMessage('');
    try {
      const { data } = await api.post('/admin/books/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateBookField('coverImage', data.data.url);
      setMessage('Book photo uploaded. Preview updated.');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Book photo upload failed.');
    } finally {
      setCoverUploading(false);
      event.target.value = '';
    }
  };

  const handleBookSubmit = async (event) => {
    event.preventDefault();
    setBookSaving(true);
    setMessage('');
    try {
      await api.post('/books', {
        ...bookForm,
        price: Number(bookForm.price),
        discountPrice: bookForm.discountPrice ? Number(bookForm.discountPrice) : undefined,
        stock: Number(bookForm.stock || 0),
        pages: Number(bookForm.pages || 0),
        status: 'published',
        tags: bookForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setBookForm(emptyBook);
      setMessage('Book published. Users can now see it in the marketplace and add it to cart.');
      await loadData({ quiet: true });
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Could not add book.');
    } finally {
      setBookSaving(false);
    }
  };

  const handleUserAction = async (userId, action, payload = {}) => {
    try {
      if (action === 'role') {
        await api.put(`/admin/users/${userId}/role`, { role: payload.role });
      }
      if (action === 'toggle') {
        await api.put(`/admin/users/${userId}/toggle-status`);
      }
      if (action === 'delete') {
        const confirmed = window.confirm('Remove this user and related content?');
        if (!confirmed) return;
        await api.delete(`/admin/users/${userId}`);
      }
      await loadData({ quiet: true });
      setMessage('User record updated.');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'User action failed.');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-[42rem]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs mb-3" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <Shield size={14} /> KavyaKosh Admin
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-[var(--color-primary)]" /> Operations Panel
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            Manage logged-in users, publish books to marketplace, track orders, and review platform health.
          </p>
        </div>
        <Button variant="secondary" onClick={() => loadData({ quiet: true })} disabled={refreshing} className="inline-flex items-center justify-center gap-2">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </Button>
      </header>

      {message && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: 'var(--color-primary)', background: 'rgba(255,93,122,0.12)' }}>
          {message}
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: stats.users || 0, icon: Users },
          { label: 'Active Users', value: activeUsers, icon: CheckCircle2 },
          { label: 'Recent Logins', value: recentLogins, icon: Clock },
          { label: 'Books', value: stats.books || 0, icon: BookOpen },
          { label: 'Orders', value: stats.orders || 0, icon: ShoppingBag },
          { label: 'Revenue', value: formatPrice(stats.revenue || 0), icon: BadgeIndianRupee },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="rounded-lg p-4!">
            <Icon size={18} className="text-[var(--color-primary)] mb-3" />
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Users size={20} /> Users Logged Into Website</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Users appear here after login, with role and account controls.</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} className="input-field pl-9 py-2! text-sm" placeholder="Search users" />
              </div>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="input-field py-2! text-sm">
                <option value="">All roles</option>
                {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          {loggedInUsers.length === 0 ? (
            <EmptyState icon={Users} title="No logged-in users found" description="Users will appear here after they sign in." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: 'var(--text-muted)' }}>
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Last Login</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loggedInUsers.map((user) => (
                    <tr key={user._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3 min-w-56">
                          <Avatar src={user.avatar} name={user.name} />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">{formatDate(user.lastLoginAt)}</td>
                      <td className="py-4 pr-4">
                        <select value={user.role} onChange={(event) => handleUserAction(user._id, 'role', { role: event.target.value })} className="input-field py-2! text-xs capitalize">
                          {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge variant={user.isActive ? 'success' : 'default'}>{user.isActive ? 'Active' : 'Disabled'}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button title={user.isActive ? 'Disable user' : 'Enable user'} onClick={() => handleUserAction(user._id, 'toggle')} className="btn-secondary !p-2">
                            {user.isActive ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                          </button>
                          <button title="Remove user" onClick={() => handleUserAction(user._id, 'delete')} className="rounded-lg border border-red-500/40 p-2 text-red-500">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="rounded-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5"><Sparkles size={20} /> Admin Signals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-lg p-4" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Published Books</p>
              <p className="text-2xl font-bold mt-1">{books.filter((book) => book.status === 'published').length}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Requests</p>
              <p className="text-2xl font-bold mt-1">{stats.aiRequests || 0}</p>
            </div>
          </div>
          <div className="h-64">
            <Doughnut data={{
              labels: analytics?.topGenres?.map((item) => item._id) || [],
              datasets: [{ data: analytics?.topGenres?.map((item) => item.count) || [], backgroundColor: ['#ff5d7a', '#7c3aed', '#1f4ed8', '#f2b75b', '#22c55e'] }],
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8c94b6' } } } }} />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_24rem] gap-6">
        <Card className="rounded-lg">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Plus size={20} /> Add Book Into Marketplace</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Admin can upload photo, set price, write about the book, and publish it as a card for users to buy or add to cart.
              </p>
            </div>
          </div>

          <form onSubmit={handleBookSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Book Title" required value={bookForm.title} onChange={(event) => updateBookField('title', event.target.value)} />
            <Input label="Subtitle" value={bookForm.subtitle} onChange={(event) => updateBookField('subtitle', event.target.value)} />
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Book Photo</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <button type="button" onClick={() => fileRef.current?.click()} className="input-field flex items-center justify-center gap-2">
                <Upload size={16} /> {coverUploading ? 'Uploading...' : 'Upload Cover'}
              </button>
            </div>
            <Input label="Cover URL" required value={bookForm.coverImage} onChange={(event) => updateBookField('coverImage', event.target.value)} placeholder="Auto-filled after upload or paste image URL" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select className="input-field" value={bookForm.category} onChange={(event) => updateBookField('category', event.target.value)}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Format</label>
              <select className="input-field" value={bookForm.format} onChange={(event) => updateBookField('format', event.target.value)}>
                <option value="ebook">Ebook</option>
                <option value="physical">Physical</option>
                <option value="audiobook">Audiobook</option>
                <option value="all">All</option>
              </select>
            </div>
            <Input label="Price" type="number" min="0" required value={bookForm.price} onChange={(event) => updateBookField('price', event.target.value)} />
            <Input label="Offer Price" type="number" min="0" value={bookForm.discountPrice} onChange={(event) => updateBookField('discountPrice', event.target.value)} />
            <Input label="Stock" type="number" min="0" value={bookForm.stock} onChange={(event) => updateBookField('stock', event.target.value)} />
            <Input label="Pages" type="number" min="1" value={bookForm.pages} onChange={(event) => updateBookField('pages', event.target.value)} />
            <Input label="Publisher" value={bookForm.publisher} onChange={(event) => updateBookField('publisher', event.target.value)} />
            <Input label="ISBN" value={bookForm.isbn} onChange={(event) => updateBookField('isbn', event.target.value)} />
            <Input label="Tags" value={bookForm.tags} onChange={(event) => updateBookField('tags', event.target.value)} placeholder="romance, hindi, classic" />
            <div className="flex items-center gap-4 pt-7">
              {[
                ['featured', 'Featured'],
                ['bestseller', 'Bestseller'],
                ['newArrival', 'New'],
              ].map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={bookForm[field]} onChange={(event) => updateBookField(field, event.target.checked)} />
                  {label}
                </label>
              ))}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>About Book</label>
              <textarea className="input-field mt-2 min-h-32 resize-y" required value={bookForm.description} onChange={(event) => updateBookField('description', event.target.value)} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={bookSaving || coverUploading} className="inline-flex items-center gap-2">
                <PackageCheck size={16} /> {bookSaving ? 'Publishing...' : 'Publish to Marketplace'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-lg !p-0 overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold flex items-center gap-2"><Eye size={18} /> User Marketplace Card</h2>
          </div>
          <div className="p-5">
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
              {bookForm.coverImage ? (
                <img src={bookForm.coverImage} alt={bookForm.title || 'Book cover'} className="h-64 w-full object-cover" />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                  <ImagePlus size={38} />
                  <span className="text-sm mt-2">Cover preview</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold line-clamp-2">{bookForm.title || 'Book title'}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{bookForm.category} · {bookForm.format}</p>
                  </div>
                  <Badge variant="gold">{bookForm.newArrival ? 'New' : 'Book'}</Badge>
                </div>
                <p className="text-sm mt-3 line-clamp-4" style={{ color: 'var(--text-muted)' }}>
                  {bookForm.description || 'About the book will appear here for readers before they buy or add it to cart.'}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="rounded-lg p-2" style={{ background: 'var(--bg-card)' }}>Views<br />0</div>
                  <div className="rounded-lg p-2" style={{ background: 'var(--bg-card)' }}>Reviews<br />0</div>
                  <div className="rounded-lg p-2" style={{ background: 'var(--bg-card)' }}>Stock<br />{bookForm.stock || 0}</div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(Number(bookForm.discountPrice || bookForm.price || 0))}</span>
                  {bookForm.discountPrice && <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>{formatPrice(Number(bookForm.price || 0))}</span>}
                </div>
                <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2" type="button">
                  <ShoppingBag size={15} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="rounded-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5"><BookOpen size={20} /> Recent Marketplace Books</h2>
          <div className="space-y-4">
            {books.length === 0 ? (
              <EmptyState icon={BookOpen} title="No books yet" description="Published books will appear here after admin adds them." />
            ) : books.map((book) => (
              <div key={book._id} className="flex items-center gap-4 rounded-lg p-3" style={{ background: 'var(--bg-secondary)' }}>
                <img src={book.coverImage} alt={book.title} className="h-20 w-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium line-clamp-1">{book.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{book.category} · {book.reviewCount || 0} reviews · {book.sales || 0} sales · {book.stock || 0} stock</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {book.featured && <Badge>Featured</Badge>}
                    {book.bestseller && <Badge variant="gold">Bestseller</Badge>}
                    {book.status !== 'published' && <Badge>{book.status}</Badge>}
                  </div>
                </div>
                <p className="font-semibold text-[var(--color-primary)]">{formatPrice(book.discountPrice || book.price)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-lg">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5"><Filter size={20} /> Growth and Revenue</h2>
          <div className="grid grid-cols-1 gap-5">
            <div className="h-56">
              <Line data={{
                labels: analytics?.userGrowth?.map((item) => item._id) || [],
                datasets: [{ label: 'New Users', data: analytics?.userGrowth?.map((item) => item.count) || [], borderColor: '#ff5d7a', backgroundColor: '#ff5d7a', tension: 0.35 }],
              }} options={chartOptions} />
            </div>
            <div className="h-56">
              <Bar data={{
                labels: analytics?.bookSales?.map((item) => item._id) || [],
                datasets: [{ label: 'Revenue', data: analytics?.bookSales?.map((item) => item.revenue) || [], backgroundColor: '#f2b75b' }],
              }} options={chartOptions} />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
