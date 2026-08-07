import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Input, Button, Card } from '../components/ui';
import { registerUser } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold">Join KavyaKosh</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Start your literary journey today</p>
        </div>

        <Card>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" error={errors.name?.message}
              {...register('name', { required: 'Name is required' })} />
            <Input label="Email" type="email" error={errors.email?.message}
              {...register('email', { required: 'Email is required' })} />
            <Input label="Password" type="password" error={errors.password?.message}
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Confirm password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" className="text-[var(--color-primary)] hover:underline">Sign in</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
