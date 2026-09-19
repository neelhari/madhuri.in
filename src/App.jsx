import React, { useState, useEffect } from 'react';
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
import { SearchPage } from './pages/SearchPage';
import { OffersPage } from './pages/OffersPage';

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
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
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

    // 9. Account Page
    if (currentPath === '/account') {
      return (
        <AccountPage
          navigate={navigate}
          onOpenWholesale={() => setIsWholesaleOpen(true)}
        />
      );
    }

    // 10. Search Page
    if (currentPath === '/search') {
      const initialQuery = searchParams.get('q') || '';
      return <SearchPage initialQuery={initialQuery} navigate={navigate} />;
    }

    // 11. Offers Page
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
    <LocationProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ToastProvider>
              <div className="madurfresh-app-root">
                {/* Brand Splash Screen Animation */}
                {showSplash && (
                  <SplashScreen onComplete={() => setShowSplash(false)} />
                )}

                {/* Global Header */}
                <Header
                  currentRoute={currentPath}
                  navigate={navigate}
                  onOpenWholesale={() => setIsWholesaleOpen(true)}
                />

                {/* Main Content Body */}
                <main className="main-content-wrapper">
                  {renderCurrentPage()}
                </main>

                {/* Floating Cart Bar (App-like for Mobile and Desktop) */}
                <FloatingCartBar
                  currentRoute={currentPath}
                  navigate={navigate}
                />

                {/* Global Footer */}
                <Footer
                  navigate={navigate}
                  onOpenWholesale={() => setIsWholesaleOpen(true)}
                />

                {/* Mobile Bottom Navigation */}
                <BottomNavigation
                  currentRoute={currentPath}
                  navigate={navigate}
                />

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
  );
};

export default App;
