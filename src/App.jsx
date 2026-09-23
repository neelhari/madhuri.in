import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LocationProvider } from './context/LocationContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './context/ToastContext';

import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Footer } from './components/Footer';
import { WholesaleModal } from './components/WholesaleModal';
import { LocationModal } from './components/LocationModal';
import { ToastContainer } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';

import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { OffersPage } from './pages/OffersPage';
import { AdminPage } from './pages/AdminPage';

export const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (url) => {
    const [path, search] = url.split('?');
    window.history.pushState({}, '', url);
    setCurrentPath(path || '/');
    setSearchParams(new URLSearchParams(search ? `?${search}` : ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  const renderCurrentPage = () => {
    // 0. Admin Panel Route
    if (isAdminRoute) {
      let initialTab = 'products';
      if (currentPath === '/admin/banners') initialTab = 'banners';
      else if (currentPath === '/admin/categories') initialTab = 'categories';
      else if (currentPath === '/admin/products') initialTab = 'products';
      else if (currentPath === '/admin/inventory') initialTab = 'inventory';
      else if (currentPath === '/admin/orders') initialTab = 'orders';
      else if (currentPath === '/admin/customers') initialTab = 'customers';
      else if (currentPath === '/admin/coupons') initialTab = 'coupons';
      else if (currentPath === '/admin/settings') initialTab = 'settings';

      return <AdminPage navigate={navigate} initialTab={initialTab} />;
    }

    // 1. Homepage
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          navigate={navigate}
          onOpenWholesale={() => setIsWholesaleOpen(true)}
        />
      );
    }

    // 2. Category Listing
    if (currentPath === '/categories') {
      return <CategoryPage categoryId="all" navigate={navigate} />;
    }
    if (currentPath === '/categories/chicken') {
      return <CategoryPage categoryId="chicken" navigate={navigate} />;
    }
    if (currentPath === '/categories/mutton') {
      return <CategoryPage categoryId="mutton" navigate={navigate} />;
    }
    if (currentPath === '/categories/seafood') {
      return <CategoryPage categoryId="seafood" navigate={navigate} />;
    }

    // 3. Product Detail Page
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} navigate={navigate} />;
    }

    // 4. Cart Page
    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    // 5. Checkout Page
    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    // 6. Order Confirmation Page
    if (currentPath === '/order-confirmation') {
      const orderId = searchParams.get('orderId');
      return <OrderConfirmationPage orderId={orderId} navigate={navigate} />;
    }

    // 7. Orders Page
    if (currentPath === '/orders') {
      return <OrdersPage navigate={navigate} />;
    }

    // 8. Wishlist Page
    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} />;
    }

    // 9. Login & Account Creation Page
    if (currentPath === '/login' || currentPath === '/register') {
      const initialMode = currentPath === '/register' || searchParams.get('mode') === 'register' ? 'register' : 'login';
      const returnTo = searchParams.get('returnTo') || '/account';
      return (
        <LoginPage
          navigate={navigate}
          initialMode={initialMode}
          returnTo={returnTo}
        />
      );
    }

    // 10. Account Page
    if (currentPath === '/account') {
      return (
        <AccountPage
          navigate={navigate}
          onOpenWholesale={() => setIsWholesaleOpen(true)}
        />
      );
    }

    // 11. Search Page
    if (currentPath === '/search') {
      const initialQuery = searchParams.get('q') || '';
      return <SearchPage initialQuery={initialQuery} navigate={navigate} />;
    }

    // 12. Offers Page
    if (currentPath === '/offers') {
      return <OffersPage navigate={navigate} />;
    }

    // Fallback: Home
    return (
      <HomePage
        navigate={navigate}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
      />
    );
  };

  return (
    <AuthProvider>
      <StoreDataProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <ToastProvider>
                  <div className="madurfresh-app-root">
                    {/* Brand Splash Screen Animation (Only on initial consumer storefront visit) */}
                    {showSplash && !isAdminRoute && (
                      <SplashScreen onComplete={() => setShowSplash(false)} />
                    )}

                    {/* Public Storefront Header (Hidden on Admin) */}
                    {!isAdminRoute && (
                      <Header
                        currentRoute={currentPath}
                        navigate={navigate}
                        onOpenWholesale={() => setIsWholesaleOpen(true)}
                      />
                    )}

                    {/* Main Content Body */}
                    <main className={isAdminRoute ? 'admin-root-wrapper' : 'main-content-wrapper'}>
                      {renderCurrentPage()}
                    </main>

                    {/* Floating Cart Bar (Hidden on Admin) */}
                    {!isAdminRoute && (
                      <FloatingCartBar
                        currentRoute={currentPath}
                        navigate={navigate}
                      />
                    )}

                    {/* Global Footer (Hidden on Admin) */}
                    {!isAdminRoute && (
                      <Footer
                        navigate={navigate}
                        onOpenWholesale={() => setIsWholesaleOpen(true)}
                      />
                    )}

                    {/* Mobile Bottom Navigation (Hidden on Admin) */}
                    {!isAdminRoute && (
                      <BottomNavigation
                        currentRoute={currentPath}
                        navigate={navigate}
                      />
                    )}

                    {/* Wholesale Modal */}
                    <WholesaleModal
                      isOpen={isWholesaleOpen}
                      onClose={() => setIsWholesaleOpen(false)}
                    />

                    {/* Location Selector Modal */}
                    <LocationModal />

                    {/* Toast Notification Container */}
                    <ToastContainer />
                  </div>
                </ToastProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </StoreDataProvider>
    </AuthProvider>
  );
};

export default App;
