// ============================================================
// NEXORA — Main Application Router
// ============================================================

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import AppLayout from '@/components/layout/AppLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import PageTransition from '@/components/layout/PageTransition';
import SplashScreen from '@/components/ui/SplashScreen';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/i18n/I18nProvider';

// ─── Lazy-loaded Pages ───
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const DropsPage = lazy(() => import('@/pages/DropsPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const InfoPage = lazy(() => import('@/pages/info/InfoPage'));

// ─── Lazy-loaded Admin Pages ───
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminPromotions = lazy(() => import('@/pages/admin/AdminPromotions'));
const AdminDrops = lazy(() => import('@/pages/admin/AdminDrops'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));

// ─── Scroll to top on route change ───
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── Loading Fallback ───
function PageLoader() {
  return (
    <div className="min-h-screen bg-[var(--v33-bg)] flex items-center justify-center">
      <SkeletonLoader type="page" />
    </div>
  );
}

// ─── Public Routes ───
function PublicRoutes() {
  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/shop/:category" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/product/:slug" element={<PageTransition><ProductDetailPage /></PageTransition>} />
          <Route path="/limited" element={<PageTransition><DropsPage /></PageTransition>} />
          <Route path="/drops" element={<Navigate to="/limited" replace />} />
          <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="/info/:slug" element={<PageTransition><InfoPage /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Admin Routes ───
function AdminRoutes() {
  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/nexora-admin/dashboard" replace />} />
          <Route path="/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/products" element={<PageTransition><AdminProducts /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><AdminOrders /></PageTransition>} />
          <Route path="/inventory" element={<PageTransition><AdminInventory /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><AdminReviews /></PageTransition>} />
          <Route path="/coupons" element={<PageTransition><AdminCoupons /></PageTransition>} />
          <Route path="/promotions" element={<PageTransition><AdminPromotions /></PageTransition>} />
          <Route path="/drops" element={<PageTransition><AdminDrops /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
          <Route path="/audit-logs" element={<PageTransition><AdminAuditLogs /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}


function SplashGate() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/nexora-admin')) return null;
  return <SplashScreen />;
}

// ─── Main App ───
export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SplashGate />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--v33-card)',
              color: 'var(--v33-text)',
              border: '1px solid var(--v33-border)',
              borderRadius: '18px',
              fontSize: '0.85rem',
            },
            success: {
              iconTheme: {
                primary: 'var(--v33-accent)',
                secondary: '#2F2520',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#050505',
              },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/*" element={<Navigate to="/nexora-admin/dashboard" replace />} />
            <Route path="/studio/*" element={<Navigate to="/nexora-admin/dashboard" replace />} />
            <Route path="/nexora-admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<PublicRoutes />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
        </HelmetProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
