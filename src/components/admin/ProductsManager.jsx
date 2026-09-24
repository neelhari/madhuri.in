import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Sparkles,
  Tag,
  DollarSign
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const ProductsManager = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
  } = useStoreData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'chicken',
    categoryName: 'Fresh Chicken',
    shortDescription: '',
    description: '',
    images: [''],
    freshnessInfo: 'Chilled at 0-4°C, Never Frozen, Daily Farm Sourced',
    handling: 'Cleaned with purified RO water, vacuum sealed for peak freshness',
    cookingRecommendation: 'Ideal for home curries and slow roasts.',
    weights: [
      {
        id: 'w-500g',
        label: '500 g',
        price: 175,
        originalPrice: 220,
        discount: 20,
        netWeight: '500g Net',
        serves: '2-3 people'
      },
      {
        id: 'w-1kg',
        label: '1 kg',
        price: 330,
        originalPrice: 420,
        discount: 21,
        netWeight: '1000g Net',
        serves: '4-5 people'
      }
    ]
  });

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const defaultCat = categories[0] || { id: 'chicken', name: 'Fresh Chicken' };
    setFormData({
      name: '',
      category: defaultCat.id,
      categoryName: defaultCat.name,
      shortDescription: '',
      description: '',
      images: [
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80'
      ],
      freshnessInfo: 'Chilled at 0-4°C, 100% Antibiotic-free',
      handling: 'Washed in RO water, vacuum sealed',
      cookingRecommendation: 'Great for homestyle curries, fry, or gravies.',
      weights: [
        {
          id: 'w-500g',
          label: '500 g',
          price: 180,
          originalPrice: 220,
          discount: 18,
          netWeight: '500g',
          serves: '2-3 people'
        },
        {
          id: 'w-1kg',
          label: '1 kg',
          price: 340,
          originalPrice: 430,
          discount: 20,
          netWeight: '1000g',
          serves: '4-5 people'
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'chicken',
      categoryName: prod.categoryName || 'Fresh Chicken',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [''],
      freshnessInfo: prod.freshnessInfo || '',
      handling: prod.handling || '',
      cookingRecommendation: prod.cookingRecommendation || '',
      weights:
        prod.weights && prod.weights.length > 0
          ? JSON.parse(JSON.stringify(prod.weights))
          : [
              {
                id: 'w-500g',
                label: '500 g',
                price: 180,
                originalPrice: 220,
                discount: 18,
                netWeight: '500g',
                serves: '2-3 people'
              }
            ]
    });
    setIsModalOpen(true);
  };

  const handleCategorySelectChange = (catId) => {
    const matched = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      category: catId,
      categoryName: matched ? matched.name : catId
    }));
  };

  // Weight variant helpers
  const handleWeightChange = (index, field, value) => {
    const updatedWeights = [...formData.weights];
    const item = { ...updatedWeights[index] };

    if (field === 'price' || field === 'originalPrice') {
      const num = parseInt(value, 10) || 0;
      item[field] = num;
      if (field === 'price' && item.originalPrice > 0) {
        item.discount = Math.max(
          0,
          Math.round(((item.originalPrice - num) / item.originalPrice) * 100)
        );
      } else if (field === 'originalPrice' && item.price > 0 && num > item.price) {
        item.discount = Math.max(
          0,
          Math.round(((num - item.price) / num) * 100)
        );
      }
    } else {
      item[field] = value;
    }

    updatedWeights[index] = item;
    setFormData((prev) => ({ ...prev, weights: updatedWeights }));
  };

  const handleAddWeightOption = () => {
    const newWeight = {
      id: `w-${Date.now().toString().slice(-4)}`,
      label: '250 g',
      price: 120,
      originalPrice: 150,
      discount: 20,
      netWeight: '250g',
      serves: '1-2 people'
    };
    setFormData((prev) => ({
      ...prev,
      weights: [...prev.weights, newWeight]
    }));
  };

  const handleRemoveWeightOption = (index) => {
    if (formData.weights.length <= 1) {
      alert('Product must have at least one weight option.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      weights: prev.weights.filter((_, i) => i !== index)
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleAddImageSlot = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImageSlot = (index) => {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [isUploadingIndex, setIsUploadingIndex] = useState(null);

  const handleFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingIndex(index);
      const res = await uploadToCloudinary(file, { folder: 'madhurfresh/products' });
      if (res.url) {
        handleImageUrlChange(index, res.url);
      }
    } catch (err) {
      console.error('Product image upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Please check your connection'));
    } finally {
      setIsUploadingIndex(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const cleanedImages = formData.images.filter((img) => img && img.trim());
    if (cleanedImages.length === 0) {
      alert('Please provide at least one product image.');
      return;
    }

    const payload = {
      ...formData,
      images: cleanedImages
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="products-manager-container">
      {/* Search & Filter Header */}
      <div className="products-top-control-bar">
        <div className="search-filter-left">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search products by title or cut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="cat-filter-pills">
            <button
              type="button"
              className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({products.length})
            </button>
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`cat-pill ${selectedCategory === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="action-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Weight Options & Pricing</th>
              <th>Status</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-products-cell">
                  <Package size={36} color="#A0AEC0" />
                  <p>No products found matching your search/filter.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => {
                const primaryImage =
                  prod.images && prod.images[0]
                    ? prod.images[0]
                    : 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=300&q=80';

                return (
                  <tr key={prod.id} className="product-table-row">
                    <td>
                      <div className="prod-cell-details">
                        <img
                          src={primaryImage}
                          alt={prod.name}
                          className="prod-thumb"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="prod-title-group">
                          <span className="prod-name-txt">{prod.name}</span>
                          <span className="prod-short-desc">
                            {prod.shortDescription || 'Fresh daily meat cut'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-tag-badge">
                        {prod.categoryName || prod.category}
                      </span>
                    </td>

                    <td>
                      <div className="weights-tags-cell">
                        {prod.weights && prod.weights.length > 0 ? (
                          prod.weights.map((w) => (
                            <div key={w.id} className="weight-price-pill">
                              <span className="w-lbl">{w.label}:</span>
                              <span className="w-price">₹{w.price}</span>
                              {w.originalPrice && w.originalPrice > w.price && (
                                <span className="w-orig">₹{w.originalPrice}</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted">No pricing set</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`status-chip-btn ${
                          prod.availability ? 'active' : 'inactive'
                        }`}
                        onClick={() => toggleProductStatus(prod.id)}
                        title="Click to toggle availability"
                      >
                        {prod.availability ? (
                          <>
                            <CheckCircle2 size={14} color="#38A169" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} color="#E53E3E" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="td-actions">
                      <div className="action-btns-group">
                        <button
                          type="button"
                          className="icon-action-btn edit-btn"
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-action-btn delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${prod.name}"?`
                              )
                            ) {
                              deleteProduct(prod.id);
                            }
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card modal-large">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-form">
              {/* Row 1: Title & Category */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Fresh Chicken Curry Cut"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => handleCategorySelectChange(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Short Description */}
              <div className="form-group">
                <label className="form-label">Short Tagline / Summary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tender farm-raised chicken cut into curry-sized pieces. 100% antibiotic-free."
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                />
              </div>

              {/* Row 3: Weight Variants & Pricing (Crucial for meat & seafood) */}
              <div className="weights-editor-section">
                <div className="weights-section-header">
                  <div>
                    <h4 className="weights-heading">Weight & Pricing Options</h4>
                    <p className="weights-sub">
                      Configure pack sizes (500g, 1kg) and prices.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-add-weight"
                    onClick={handleAddWeightOption}
                  >
                    <Plus size={14} /> Add Weight Option
                  </button>
                </div>

                <div className="weights-list">
                  {formData.weights.map((w, index) => (
                    <div key={w.id || index} className="weight-item-row">
                      <div className="weight-col">
                        <label className="w-col-label">Weight Label</label>
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="500 g"
                          value={w.label}
                          onChange={(e) =>
                            handleWeightChange(index, 'label', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="weight-col">
                        <label className="w-col-label">Selling Price (₹)</label>
                        <input
                          type="number"
                          className="form-input form-input-sm"
                          placeholder="175"
                          value={w.price}
                          onChange={(e) =>
                            handleWeightChange(index, 'price', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="weight-col">
                        <label className="w-col-label">Original Price (₹)</label>
                        <input
                          type="number"
                          className="form-input form-input-sm"
                          placeholder="220"
                          value={w.originalPrice}
                          onChange={(e) =>
                            handleWeightChange(
                              index,
                              'originalPrice',
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="weight-col">
                        <label className="w-col-label">Serves</label>
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="2-3 people"
                          value={w.serves}
                          onChange={(e) =>
                            handleWeightChange(index, 'serves', e.target.value)
                          }
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-del-weight"
                        onClick={() => handleRemoveWeightOption(index)}
                        title="Remove Weight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Images */}
              <div className="form-group">
                <div className="image-field-header">
                  <label className="form-label">Product Image URLs / Upload</label>
                  <button
                    type="button"
                    className="btn-add-img-link"
                    onClick={handleAddImageSlot}
                  >
                    <Plus size={13} /> Add Another Photo
                  </button>
                </div>

                <div className="images-inputs-list">
                  {formData.images.map((imgUrl, index) => (
                    <div key={index} className="image-input-item">
                      <div className="img-input-flex">
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://images.unsplash.com/..."
                          value={imgUrl}
                          onChange={(e) =>
                            handleImageUrlChange(index, e.target.value)
                          }
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="file-upload-compact"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-img"
                            onClick={() => handleRemoveImageSlot(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {imgUrl && (
                        <div className="img-mini-preview">
                          <img
                            src={imgUrl}
                            alt={`Preview ${index}`}
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Long Description */}
              <div className="form-group">
                <label className="form-label">Full Product Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Detailed description of the cuts, source, and packaging..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Row 6: Freshness & Cooking Recommendation */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Freshness Standards</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.freshnessInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        freshnessInfo: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cooking Recommendation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.cookingRecommendation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cookingRecommendation: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .products-manager-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .products-top-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: #FFFFFF;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
        }

        .search-filter-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          flex: 1;
        }

        .search-box {
          position: relative;
          width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #A0AEC0;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
        }

        .search-input:focus {
          border-color: #075437;
        }

        .cat-filter-pills {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cat-pill {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          background: #F7FAFC;
          color: #4A5568;
          border: 1px solid #E2E8F0;
          transition: all 0.15s ease;
        }

        .cat-pill.active {
          background: #075437;
          color: #FFFFFF;
          border-color: #075437;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #075437;
          color: #FFFFFF;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          transition: background 0.15s ease;
        }

        .action-btn-primary:hover {
          background: #053D27;
        }

        /* Products Table */
        .products-table-wrapper {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table th {
          background: #F8FAFC;
          padding: 12px 18px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E2E8F0;
        }

        .products-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #EDF2F7;
          vertical-align: middle;
        }

        .product-table-row:hover {
          background: #FDFEFE;
        }

        .prod-cell-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .prod-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          background: #EDF2F7;
          flex-shrink: 0;
        }

        .prod-title-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .prod-name-txt {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1A202C;
        }

        .prod-short-desc {
          font-size: 0.74rem;
          color: #718096;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-tag-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: #EFF8F4;
          color: #075437;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .weights-tags-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .weight-price-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }

        .w-lbl {
          font-weight: 600;
          color: #4A5568;
        }

        .w-price {
          font-weight: 800;
          color: #075437;
        }

        .w-orig {
          font-size: 0.7rem;
          color: #A0AEC0;
          text-decoration: line-through;
        }

        .status-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          border: 1px solid;
          cursor: pointer;
        }

        .status-chip-btn.active {
          background: #F0FFF4;
          border-color: #9AE6B4;
          color: #276749;
        }

        .status-chip-btn.inactive {
          background: #FFF5F5;
          border-color: #FEB2B2;
          color: #9B2C2C;
        }

        .th-actions, .td-actions {
          text-align: right;
        }

        .action-btns-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .icon-action-btn {
          padding: 7px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .edit-btn {
          background: #F7FAFC;
          color: #075437;
        }

        .edit-btn:hover {
          background: #EFF8F4;
        }

        .delete-btn {
          background: #FFF5F5;
          color: #E53E3E;
        }

        .delete-btn:hover {
          background: #FED7D7;
        }

        .no-products-cell {
          text-align: center;
          padding: 40px !important;
          color: #718096;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1500;
          padding: 16px;
        }

        .modal-card {
          background: #FFFFFF;
          border-radius: 14px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .modal-large {
          max-width: 680px;
        }

        .modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid #EDF2F7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1A202C;
        }

        .modal-close {
          font-size: 1.1rem;
          color: #A0AEC0;
          cursor: pointer;
        }

        .modal-body-form {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #2D3748;
        }

        .form-input, .form-select, .form-textarea {
          padding: 10px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input-sm {
          padding: 7px 10px;
          font-size: 0.82rem;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #075437;
          box-shadow: 0 0 0 2px rgba(7,84,55,0.1);
        }

        /* Weights Editor */
        .weights-editor-section {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .weights-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .weights-heading {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1A202C;
        }

        .weights-sub {
          font-size: 0.72rem;
          color: #718096;
        }

        .btn-add-weight {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          background: #075437;
          color: #FFFFFF;
          padding: 5px 10px;
          border-radius: 6px;
        }

        .weights-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .weight-item-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr auto;
          gap: 8px;
          align-items: flex-end;
          background: #FFFFFF;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
        }

        .weight-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .w-col-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #718096;
        }

        .btn-del-weight {
          padding: 8px;
          color: #E53E3E;
          background: #FFF5F5;
          border-radius: 6px;
          border: 1px solid #FEB2B2;
          cursor: pointer;
        }

        /* Images editor */
        .image-field-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-add-img-link {
          font-size: 0.75rem;
          color: #075437;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .images-inputs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-input-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .img-input-flex {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .file-upload-compact {
          font-size: 0.72rem;
          width: 140px;
        }

        .btn-remove-img {
          padding: 4px 8px;
          color: #A0AEC0;
          font-size: 0.85rem;
        }

        .img-mini-preview {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background: #EDF2F7;
        }

        .img-mini-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 6px;
        }

        .action-btn-cancel {
          padding: 9px 16px;
          border-radius: 8px;
          background: #EDF2F7;
          color: #4A5568;
          font-weight: 700;
          font-size: 0.85rem;
        }

        @media (max-width: 650px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .weight-item-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
