import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import { PRODUCTS, POPULAR_SEARCH_TAGS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const SearchPage = ({ initialQuery = '', navigate }) => {
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_recent_searches');
      return saved ? JSON.parse(saved) : ['Chicken Curry Cut', 'Mutton Boti', 'White Prawns'];
    } catch {
      return ['Chicken Curry Cut', 'Mutton Boti', 'White Prawns'];
    }
  });

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      const updated = [term.trim(), ...filtered].slice(0, 6);
      try {
        localStorage.setItem('madurfresh_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('madurfresh_recent_searches');
  };

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <div className="search-page animate-fade-in">
      <div className="app-container">
        <form onSubmit={handleSearchSubmit} className="search-input-form">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for chicken, mutton, seafood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="search-main-input"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
            >
              <X size={18} />
            </button>
          )}
        </form>

        {/* If no query, show Recent Searches & Popular Tags */}
        {!query.trim() ? (
          <div className="search-discovery-area">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="discovery-block">
                <div className="discovery-header">
                  <span className="discovery-title">Recent Searches</span>
                  <button
                    className="clear-recent-btn"
                    onClick={clearRecentSearches}
                  >
                    Clear All
                  </button>
                </div>
                <div className="discovery-chips-row">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      className="recent-chip"
                      onClick={() => {
                        setQuery(term);
                        saveRecentSearch(term);
                      }}
                    >
                      <Clock size={13} />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="discovery-block">
              <div className="discovery-header">
                <span className="discovery-title">Popular Searches</span>
              </div>
              <div className="discovery-chips-row">
                {POPULAR_SEARCH_TAGS.map((tag, i) => (
                  <button
                    key={i}
                    className="popular-chip"
                    onClick={() => {
                      setQuery(tag);
                      saveRecentSearch(tag);
                    }}
                  >
                    <Sparkles size={13} color="var(--primary-yellow)" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Categories */}
            <div className="discovery-block">
              <div className="discovery-header">
                <span className="discovery-title">Browse Categories</span>
              </div>
              <div className="quick-category-grid">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="quick-cat-card"
                    onClick={() => navigate(`/categories/${cat.id}`)}
                  >
                    <img src={cat.image} alt="" className="quick-cat-img" />
                    <span className="quick-cat-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Search Results */
          <div className="search-results-area">
            <div className="results-header">
              <h2 className="results-count-title">
                {searchResults.length} results for "{query}"
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="search-empty-card">
                <h3>No fresh cuts found for "{query}"</h3>
                <p>Try searching for "chicken", "mutton", or "prawns".</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .search-page {
          padding-top: 18px;
          padding-bottom: 48px;
        }

        .search-header-row {
          margin-bottom: 14px;
        }

        .search-input-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 24px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: var(--primary-green);
          pointer-events: none;
        }

        .search-main-input {
          width: 100%;
          padding: 14px 44px 14px 48px;
          background: #FFFFFF;
          border: 2px solid var(--primary-green);
          border-radius: var(--radius-pill);
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(0, 103, 56, 0.1);
        }

        .search-main-input:focus {
          outline: none;
          box-shadow: 0 4px 20px rgba(0, 103, 56, 0.2);
        }

        .search-clear-btn {
          position: absolute;
          right: 14px;
          color: var(--text-muted);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-discovery-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 680px;
        }

        .discovery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .discovery-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .clear-recent-btn {
          font-size: 0.78rem;
          font-weight: 700;
          color: #E53935;
        }

        .discovery-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .recent-chip, .popular-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
          transition: all var(--transition-fast);
        }

        .recent-chip:hover, .popular-chip:hover {
          border-color: var(--primary-green);
          background: var(--surface-light-green);
        }

        .popular-chip {
          background: var(--surface-light-green);
          border-color: #DCE8D7;
          color: var(--primary-green);
          font-weight: 700;
        }

        .quick-category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .quick-cat-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: transform var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
        }

        .quick-cat-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-green);
        }

        .quick-cat-img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 8px;
        }

        .quick-cat-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        /* Results */
        .results-count-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary-green);
          margin-bottom: 18px;
        }

        .search-empty-card {
          text-align: center;
          padding: 48px 24px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .search-empty-card h3 {
          font-size: 1.25rem;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .search-empty-card p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 18px;
        }
      `}</style>
    </div>
  );
};
