import React from 'react';
import { Heart, ArrowLeft, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = ({ navigate }) => {
  const { products } = useStoreData();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const wishlistedProducts = (products || []).filter((p) => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="wishlist-page empty-wishlist-page animate-fade-in">
        <div className="app-container">
          <div className="empty-wishlist-card">
            <div className="empty-icon-wrap">
              <Heart size={48} color="var(--primary-green)" />
            </div>
            <h2 className="empty-title">Your wishlist is waiting</h2>
            <p className="empty-desc">
              Save your favorite chicken cuts, goat mutton, and coastal prawns here
              for quick ordering anytime.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/categories')}
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <style>{`
          .empty-wishlist-page {
            padding: 60px 0;
          }
          .empty-wishlist-card {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-xl);
            padding: 48px 24px;
            text-align: center;
            max-width: 480px;
            margin: 0 auto;
            box-shadow: var(--shadow-sm);
          }
          .empty-icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: var(--surface-light-green);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }
          .empty-title {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--primary-green);
            margin-bottom: 8px;
          }
          .empty-desc {
            font-size: 0.95rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 28px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wishlist-page animate-fade-in">
      <div className="app-container">
        <div className="wishlist-header-row">
          <h1 className="wishlist-title">My Wishlist ({wishlistedProducts.length})</h1>
        </div>

        <div className="products-grid wishlist-grid">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
            />
          ))}
        </div>
      </div>

      <style>{`
        .wishlist-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .wishlist-header-row {
          margin-bottom: 20px;
        }

        .wishlist-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-top: 8px;
        }

        .wishlist-grid {
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};
