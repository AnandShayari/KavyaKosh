import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Card, Button, EmptyState, Skeleton } from '../components/ui';
import { formatPrice } from '../lib/utils';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setCart, clearCart } from '../features/cart/cartSlice';

export default function CartPage() {
  const [cart, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/books/cart').then((r) => { setCartData(r.data.data); dispatch(setCart(r.data.data)); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/books/cart/${itemId}`);
    setCartData(data.data);
    dispatch(setCart(data.data));
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      await api.post('/books/orders', { paymentMethod: 'razorpay' });
      dispatch(clearCart());
      setCartData({ items: [] });
    } catch { /* empty */ }
    setCheckingOut(false);
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.book?.discountPrice || item.book?.price || 0) * item.quantity, 0) || 0;

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-64" /></div>;

  if (!cart?.items?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Browse our marketplace to find literary treasures"
          action={<Link to="/marketplace" className="btn-primary">Browse Books</Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2"><ShoppingCart /> Shopping Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <Card key={item._id} className="flex items-center gap-4 !p-4">
            <img src={item.book?.coverImage} alt="" className="w-16 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium">{item.book?.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.format} · Qty: {item.quantity}</p>
            </div>
            <p className="font-bold">{formatPrice((item.book?.discountPrice || item.book?.price) * item.quantity)}</p>
            <button onClick={() => removeItem(item._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 size={18} /></button>
          </Card>
        ))}
      </div>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Subtotal</p>
          <p className="text-2xl font-bold">{formatPrice(subtotal)}</p>
        </div>
        <Button onClick={checkout} disabled={checkingOut} className="flex items-center gap-2">
          {checkingOut ? 'Processing...' : 'Checkout'} <ArrowRight size={18} />
        </Button>
      </Card>
    </div>
  );
}
