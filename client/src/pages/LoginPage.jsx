import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Input, Button, Card } from '../components/ui';
import { loginUser } from '../features/auth/authSlice';

const adminRoles = ['admin', 'moderator'];

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get('error');
  const { loading, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const apiOrigin = apiUrl.replace(/\/api\/?$/, '');

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const homePath = adminRoles.includes(result.payload.user?.role) ? '/admin' : '/dashboard';
      navigate(homePath);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to your KavyaKosh account</p>
        </div>

        <Card>
          {(error || oauthError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {oauthError ? 'OAuth sign in failed. Please try again.' : error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" error={errors.email?.message}
              {...register('email', { required: 'Email is required' })} />
            <div className="relative">
              <Input label="Password" type={showPass ? 'text' : 'password'} error={errors.password?.message}
                {...register('password', { required: 'Password is required' })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[var(--color-primary)] hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account? <Link to="/register" className="text-[var(--color-primary)] hover:underline">Sign up</Link>
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => window.location.href = `${apiOrigin}/api/auth/google`} className="btn-secondary flex-1 text-sm !py-2.5">Google</button>
            <button onClick={() => window.location.href = `${apiOrigin}/api/auth/github`} className="btn-secondary flex-1 text-sm !py-2.5">GitHub</button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
