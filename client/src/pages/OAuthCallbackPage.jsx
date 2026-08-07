import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from '../features/auth/authSlice';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    localStorage.setItem('accessToken', token);
    dispatch(fetchMe()).then((result) => {
      if (fetchMe.fulfilled.match(result)) {
        const role = result.payload?.role;
        navigate(['admin', 'moderator'].includes(role) ? '/admin' : '/dashboard', { replace: true });
      } else {
        navigate('/login?error=oauth_failed', { replace: true });
      }
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
        <p style={{ color: 'var(--text-muted)' }}>Completing sign in...</p>
      </div>
    </div>
  );
}
