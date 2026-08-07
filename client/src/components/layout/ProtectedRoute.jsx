import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const adminRoles = ['admin', 'moderator'];

function AuthLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-[var(--border-color)] border-t-[var(--color-primary)] animate-spin" />
    </div>
  );
}

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, token, checkingAuth } = useSelector((s) => s.auth);
  if (checkingAuth || (token && isAuthenticated && !user)) return <AuthLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user, token, checkingAuth } = useSelector((s) => s.auth);
  if (checkingAuth || (token && isAuthenticated && !user)) return <AuthLoader />;
  if (isAuthenticated) {
    const homePath = adminRoles.includes(user?.role) ? '/admin' : '/dashboard';
    return <Navigate to={homePath} replace />;
  }
  return children;
}
