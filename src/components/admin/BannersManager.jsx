import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const BannersManager = () => {
  const {
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    categoryBanners,
    updateCategoryBanner,
    categories
  } = useStoreData();

  // Active sub-tab: 'home' | 'categories'
  const [activeBannerTab, setActiveBannerTab] = useState('home');

  // Modal State for Home Banners
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'chicken',
    image: ''
  });

  // Modal State for Category Banner Edit
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatBanner, setEditingCatBanner] = useState(null);
  const [catFormData, setCatFormData] = useState({
    categoryId: '',
    categoryName: '',
    bannerImage: '',
    tagline: '',
    promoText: ''
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      category: categories[0]?.id || 'chicken',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      category: banner.category || 'chicken',
      image: banner.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitHomeBanner = (e) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      alert('Please provide an image URL or upload an image.');
      return;
    }

    if (editingBanner) {
      updateHeroBanner(editingBanner.id, formData);
    } else {
      addHeroBanner(formData);
    }
    setIsModalOpen(false);
  };

  const handleOpenEditCatBanner = (cb) => {
    setEditingCatBanner(cb);
    setCatFormData({
      categoryId: cb.categoryId,
      categoryName: cb.categoryName,
      bannerImage: cb.bannerImage || '',
      tagline: cb.tagline || '',
      promoText: cb.promoText || ''
    });
    setIsCatModalOpen(true);
  };

  const handleSubmitCatBanner = (e) => {
    e.preventDefault();
    if (!catFormData.bannerImage.trim()) {
      alert('Please provide a banner image URL.');
      return;
    }
    updateCategoryBanner(catFormData.categoryId, catFormData);
    setIsCatModalOpen(false);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadToCloudinary(file, {
        folder: target === 'home' ? 'madhurfresh/banners/home' : 'madhurfresh/banners/categories'
      });
      if (res.url) {
        if (target === 'home') {
          setFormData((prev) => ({ ...prev, image: res.url }));
        } else {
          setCatFormData((prev) => ({ ...prev, bannerImage: res.url }));
        }
      }
    } catch (err) {
      console.error('Banner upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Please check your connection'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="banners-manager-container">
      {/* Tab Switcher */}
      <div className="tab-switcher-row">
        <div className="tab-pill-group">
          <button
            type="button"
            className={`tab-pill-btn ${activeBannerTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveBannerTab('home')}
          >
            Homepage Hero Banners ({heroBanners.length})
          </button>
          <button
            type="button"
            className={`tab-pill-btn ${activeBannerTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveBannerTab('categories')}
          >
            Category Page Headers ({categoryBanners.length})
          </button>
        </div>

        {activeBannerTab === 'home' && (
          <button
            type="button"
            className="action-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Add Home Banner</span>
          </button>
        )}
      </div>

      {/* HOMEPAGE BANNERS SECTION */}
      {activeBannerTab === 'home' && (
        <div className="banners-grid">
          {heroBanners.length === 0 ? (
            <div className="empty-state-box">
              <ImageIcon size={48} color="#A0AEC0" />
              <h3>No Home Banners Active</h3>
              <p>Add promotional slides to display at the top of the homepage.</p>
              <button
                type="button"
                className="action-btn-primary"
                onClick={handleOpenAdd}
              >
                <Plus size={16} />
                <span>Add Banner</span>
              </button>
            </div>
          ) : (
            heroBanners.map((banner, index) => (
              <div key={banner.id} className="banner-card">
                <div className="banner-image-wrap">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="banner-index-tag">Slide #{index + 1}</span>
                  <span className="banner-cat-tag">Target: {banner.category}</span>
                </div>

                <div className="banner-info-bar">
                  <div className="banner-title-text">
                    <h4>{banner.title || 'Untitled Banner'}</h4>
                    <span className="banner-target-link">
                      Links to: /categories/{banner.category}
                    </span>
                  </div>

                  <div className="banner-actions">
                    <button
                      type="button"
                      className="icon-action-btn edit-btn"
                      onClick={() => handleOpenEdit(banner)}
                      title="Edit Banner"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn delete-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${banner.title}"?`
                          )
                        ) {
                          deleteHeroBanner(banner.id);
                        }
                      }}
                      title="Delete Banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CATEGORY PAGE BANNERS SECTION */}
      {activeBannerTab === 'categories' && (
        <div className="category-banners-list">
          {categoryBanners.map((cb) => (
            <div key={cb.categoryId} className="cat-banner-row-card">
              <div className="cat-banner-img-preview">
                <img
                  src={cb.bannerImage}
                  alt={cb.categoryName}
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="cat-banner-details">
                <div className="cat-header-title-row">
                  <h3>{cb.categoryName} Header Banner</h3>
                  <span className="route-tag">/categories/{cb.categoryId}</span>
                </div>
                <p className="cat-tagline-text">
                  <strong>Tagline:</strong> {cb.tagline || 'None'}
                </p>
                <p className="cat-promo-text">
                  <strong>Promo Highlight:</strong> {cb.promoText || 'None'}
                </p>
              </div>

              <div className="cat-banner-actions">
                <button
                  type="button"
                  className="action-btn-outline"
                  onClick={() => handleOpenEditCatBanner(cb)}
                >
                  <Edit2 size={15} />
                  <span>Update Header</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT HOME BANNER */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingBanner ? 'Edit Home Banner' : 'Add New Home Banner'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitHomeBanner} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Banner Title / Headline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Farm Fresh Chicken"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Destination Link</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (/categories/{c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'home')}
                  className="file-input"
                />
              </div>

              {formData.image && (
                <div className="image-live-preview">
                  <span className="preview-label">Live Preview:</span>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>
              )}

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY BANNER */}
      {isCatModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit {catFormData.categoryName} Header Banner</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCatModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCatBanner} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Header Banner Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={catFormData.bannerImage}
                  onChange={(e) =>
                    setCatFormData({
                      ...catFormData,
                      bannerImage: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Header Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cat')}
                  className="file-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Tagline</label>
                <select
                  className="form-select"
                  value={catFormData.tagline}
                  onChange={(e) =>
                    setCatFormData({ ...catFormData, tagline: e.target.value })
                  }
                >
                  <option value="100% Antibiotic-free & ethically raised farm chicken">
                    100% Antibiotic-free & ethically raised farm chicken
                  </option>
                  <option value="Tender pasture-raised grass-fed goat meat cuts">
                    Tender pasture-raised grass-fed goat meat cuts
                  </option>
                  <option value="Coastal daily morning catch, cleaned and deveined">
                    Coastal daily morning catch, cleaned and deveined
                  </option>
                  <option value="Fresh artisanal cuts prepared daily by master butchers">
                    Fresh artisanal cuts prepared daily by master butchers
                  </option>
                  <option value="Zero chemical preservatives, 100% pure freshness">
                    Zero chemical preservatives, 100% pure freshness
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Promo Sub-Badge / Feature Highlight</label>
                <select
                  className="form-select"
                  value={catFormData.promoText}
                  onChange={(e) =>
                    setCatFormData({ ...catFormData, promoText: e.target.value })
                  }
                >
                  <option value="Daily fresh butchery • Vacuum sealed">
                    Daily fresh butchery • Vacuum sealed
                  </option>
                  <option value="Artisanal hand-trimmed • Zero hormones">
                    Artisanal hand-trimmed • Zero hormones
                  </option>
                  <option value="Chemical-free • Net cookable weight">
                    Chemical-free • Net cookable weight
                  </option>
                  <option value="Chilled at 0-4°C • Never frozen">
                    Chilled at 0-4°C • Never frozen
                  </option>
                  <option value="100% RO washed • Farm fresh">
                    100% RO washed • Farm fresh
                  </option>
                </select>
              </div>

              {catFormData.bannerImage && (
                <div className="image-live-preview">
                  <span className="preview-label">Live Preview:</span>
                  <img
                    src={catFormData.bannerImage}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>
              )}

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => setIsCatModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  Update Category Header
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .banners-manager-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tab-switcher-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tab-pill-group {
          display: flex;
          background: #EDF2F7;
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }

        .tab-pill-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #4A5568;
          transition: all 0.15s ease;
        }

        .tab-pill-btn.active {
          background: #FFFFFF;
          color: #075437;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

        .action-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          color: #075437;
          border: 1.5px solid #075437;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.15s ease;
        }

        .action-btn-outline:hover {
          background: #EFF8F4;
        }

        .action-btn-cancel {
          padding: 9px 16px;
          border-radius: 8px;
          background: #EDF2F7;
          color: #4A5568;
          font-weight: 700;
          font-size: 0.85rem;
        }

        /* Banners Grid */
        .banners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .banner-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .banner-image-wrap {
          position: relative;
          height: 170px;
          background: #E2E8F0;
        }

        .banner-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-index-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.7);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .banner-cat-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #075437;
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .banner-info-bar {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .banner-title-text h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1A202C;
          margin-bottom: 2px;
        }

        .banner-target-link {
          font-size: 0.75rem;
          color: #718096;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-action-btn {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .edit-btn {
          color: #075437;
          background: #F7FAFC;
        }

        .edit-btn:hover {
          background: #EFF8F4;
        }

        .delete-btn {
          color: #E53E3E;
          background: #FFF5F5;
        }

        .delete-btn:hover {
          background: #FED7D7;
        }

        /* Category Banners List */
        .category-banners-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cat-banner-row-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .cat-banner-img-preview {
          width: 140px;
          height: 85px;
          border-radius: 8px;
          overflow: hidden;
          background: #EDF2F7;
          flex-shrink: 0;
        }

        .cat-banner-img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-banner-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cat-header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cat-header-title-row h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #1A202C;
        }

        .route-tag {
          font-size: 0.72rem;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 7px;
          border-radius: 4px;
          font-family: monospace;
        }

        .cat-tagline-text, .cat-promo-text {
          font-size: 0.8rem;
          color: #4A5568;
        }

        /* Empty State */
        .empty-state-box {
          grid-column: 1 / -1;
          background: #FFFFFF;
          border: 1px dashed #CBD5E0;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-state-box h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2D3748;
        }

        .empty-state-box p {
          font-size: 0.85rem;
          color: #718096;
        }

        /* Modals */
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
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .modal-header {
          padding: 18px 22px;
          border-bottom: 1px solid #EDF2F7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1A202C;
        }

        .modal-close {
          font-size: 1.1rem;
          color: #A0AEC0;
          cursor: pointer;
        }

        .modal-body-form {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
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

        .form-input, .form-select {
          padding: 10px 14px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input:focus, .form-select:focus {
          border-color: #075437;
          box-shadow: 0 0 0 2px rgba(7,84,55,0.1);
        }

        .file-input {
          font-size: 0.82rem;
          color: #718096;
        }

        .image-live-preview {
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .preview-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #718096;
        }

        .preview-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 6px;
        }

        .modal-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .cat-banner-row-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .cat-banner-img-preview {
            width: 100%;
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};
