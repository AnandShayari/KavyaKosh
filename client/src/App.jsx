import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './app/store';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute, GuestRoute } from './components/layout/ProtectedRoute';
import { Skeleton } from './components/ui';
import { fetchMe } from './features/auth/authSlice';

const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AIStudioPage = lazy(() => import('./pages/AIStudioPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const PublishPage = lazy(() => import('./pages/PublishPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const PoetryDetailPage = lazy(() => import('./pages/PoetryDetailPage'));
const DashboardLayout = lazy(() => import('./pages/DashboardPage'));
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64" />
    </div>
  );
}

function AppShell() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="ai-studio" element={<AIStudioPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="marketplace/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="poetry/:id" element={<PoetryDetailPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="publish" element={<ProtectedRoute><PublishPage /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute roles={['admin', 'moderator']}><AdminPage /></ProtectedRoute>} />
                <Route path="admin/*" element={<ProtectedRoute roles={['admin', 'moderator']}><AdminPage /></ProtectedRoute>} />
                <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardOverview />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="auth/callback" element={<OAuthCallbackPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
