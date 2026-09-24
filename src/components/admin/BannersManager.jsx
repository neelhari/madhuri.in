import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  Leaf,
  Globe
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
    organicAdBanner,
    updateOrganicAdBanner,
    categories
  } = useStoreData();

  // Active sub-tab: 'home' | 'categories' | 'ad'
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

  // Modal State for Ad Promo Banner Edit
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adFormData, setAdFormData] = useState({
    title: 'Natural & Organic',
    tagline: 'Sister Store',
    buttonText: 'Visit madur.in',
    redirectUrl: 'https://madur.in',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80',
    isActive: true
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

  const handleOpenEditAdBanner = () => {
    setAdFormData({
      title: organicAdBanner?.title || 'Natural & Organic',
      tagline: organicAdBanner?.tagline || 'Sister Store',
      buttonText: organicAdBanner?.buttonText || 'Visit madur.in',
      redirectUrl: organicAdBanner?.redirectUrl || 'https://madur.in',
      image:
        organicAdBanner?.image ||
        'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80',
      isActive: organicAdBanner?.isActive !== false
    });
    setIsAdModalOpen(true);
  };

  const handleSubmitAdBanner = (e) => {
    e.preventDefault();
    if (!adFormData.image.trim()) {
      alert('Please provide a banner image.');
      return;
    }
    updateOrganicAdBanner(adFormData);
    setIsAdModalOpen(false);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadToCloudinary(file, {
        folder:
          target === 'home'
            ? 'madhurfresh/banners/home'
            : target === 'ad'
            ? 'madhurfresh/banners/ad'
            : 'madhurfresh/banners/categories'
      });
      if (res.url) {
        if (target === 'home') {
          setFormData((prev) => ({ ...prev, image: res.url }));
        } else if (target === 'ad') {
          setAdFormData((prev) => ({ ...prev, image: res.url }));
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
            className={`tab-pill-btn ${activeBannerTab === 'ad' ? 'active' : ''}`}
            onClick={() => setActiveBannerTab('ad')}
          >
            <Leaf size={14} style={{ color: '#16A34A' }} />
            <span>Ad Promo Banner (Natural & Organic)</span>
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

      {/* 1. HOMEPAGE HERO BANNERS */}
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

      {/* 2. AD PROMO BANNER (NATURAL & ORGANIC) */}
      {activeBannerTab === 'ad' && (
        <div className="ad-promo-manage-section">
          <div className="ad-promo-manage-card">
            <div className="ad-promo-preview-header">
              <div>
                <h3>Natural & Organic Homepage Ad Banner</h3>
                <p className="ad-promo-desc">
                  Compact promotional banner displayed on the homepage with custom redirect link to your organic website.
                </p>
              </div>

              <div className="ad-header-actions">
                <button
                  type="button"
                  className="action-btn-primary"
                  onClick={handleOpenEditAdBanner}
                >
                  <Edit2 size={15} />
                  <span>Edit Ad Banner & Link</span>
                </button>
              </div>
            </div>

            {/* Live Banner Visual Mockup */}
            <div className="ad-live-visual-card">
              <div
                className="ad-mockup-banner"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.1) 100%), url(${organicAdBanner?.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80'})`
                }}
              >
                <div className="ad-mockup-bottom">
                  <div className="ad-mockup-text">
                    <span className="ad-mockup-tag">{organicAdBanner?.tagline || 'Sister Store'}</span>
                    <h4 className="ad-mockup-title">{organicAdBanner?.title || 'Natural & Organic'}</h4>
                  </div>
                  <div className="ad-mockup-btn">
                    <span>{organicAdBanner?.buttonText || 'Visit madur.in'}</span>
                  </div>
                </div>
              </div>

              {/* Meta Config Bar */}
              <div className="ad-meta-info-grid">
                <div className="meta-info-box">
                  <span className="meta-lbl">Banner Heading</span>
                  <span className="meta-val">{organicAdBanner?.title || 'Natural & Organic'}</span>
                </div>
                <div className="meta-info-box">
                  <span className="meta-lbl">Redirect Link (URL)</span>
                  <a
                    href={organicAdBanner?.redirectUrl || 'https://madur.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="meta-val-link"
                  >
                    <span>{organicAdBanner?.redirectUrl || 'https://madur.in'}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="meta-info-box">
                  <span className="meta-lbl">Button Label</span>
                  <span className="meta-val">{organicAdBanner?.buttonText || 'Visit madur.in'}</span>
                </div>
                <div className="meta-info-box">
                  <span className="meta-lbl">Status</span>
                  <span className={`badge ${organicAdBanner?.isActive !== false ? 'badge-success' : 'badge-inactive'}`}>
                    {organicAdBanner?.isActive !== false ? '● Active on Homepage' : '○ Hidden'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PAGE HEADERS */}
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

      {/* MODAL: EDIT AD PROMO BANNER */}
      {isAdModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Natural & Organic Ad Banner</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsAdModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdBanner} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Banner Heading / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Natural & Organic"
                  value={adFormData.title}
                  onChange={(e) =>
                    setAdFormData({ ...adFormData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Redirect Link (Destination URL) *</label>
                <div className="input-with-icon-left">
                  <Globe size={16} className="input-icon-left" />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://madur.in"
                    value={adFormData.redirectUrl}
                    onChange={(e) =>
                      setAdFormData({ ...adFormData, redirectUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <span className="form-hint">
                  Where users will be redirected when clicking the banner or button (e.g. <code>https://madur.in</code>)
                </span>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Subtitle / Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sister Store"
                    value={adFormData.tagline}
                    onChange={(e) =>
                      setAdFormData({ ...adFormData, tagline: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Button Label</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Visit madur.in"
                    value={adFormData.buttonText}
                    onChange={(e) =>
                      setAdFormData({ ...adFormData, buttonText: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={adFormData.image}
                  onChange={(e) =>
                    setAdFormData({ ...adFormData, image: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Banner Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'ad')}
                  className="file-input"
                />
                {isUploading && (
                  <span className="uploading-text">Uploading image to cloud storage...</span>
                )}
              </div>

              {adFormData.image && (
                <div className="image-live-preview">
                  <span className="preview-label">Live Preview:</span>
                  <img
                    src={adFormData.image}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>
              )}

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={adFormData.isActive}
                    onChange={(e) =>
                      setAdFormData({ ...adFormData, isActive: e.target.checked })
                    }
                  />
                  <span>Show this Ad Banner on the Homepage</span>
                </label>
              </div>

              <div className="modal-footer-row">
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => setIsAdModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
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
                <label className="form-label">Promo Highlight Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={catFormData.promoText}
                  onChange={(e) =>
                    setCatFormData({ ...catFormData, promoText: e.target.value })
                  }
                />
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
                  Save Changes
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
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 14px;
        }

        .tab-pill-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tab-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #4A5568;
          background: #EDF2F7;
          border-radius: var(--radius-pill);
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-pill-btn.active {
          background: #075437;
          color: #FFFFFF;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #075437;
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .action-btn-primary:hover {
          background: #053D27;
        }

        .banners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .banner-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }

        .banner-image-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          background: #F7FAFC;
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
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 0.72rem;
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
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .banner-info-bar {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #EDF2F7;
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
          gap: 6px;
        }

        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          cursor: pointer;
          color: #4A5568;
          transition: all 0.15s ease;
        }

        .icon-action-btn.edit-btn:hover {
          color: #075437;
          border-color: #075437;
          background: #EFF8F4;
        }

        .icon-action-btn.delete-btn:hover {
          color: #E53E3E;
          border-color: #E53E3E;
          background: #FFF5F5;
        }

        /* AD PROMO SECTION */
        .ad-promo-manage-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ad-promo-manage-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .ad-promo-preview-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ad-promo-preview-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1A202C;
          margin-bottom: 4px;
        }

        .ad-promo-desc {
          font-size: 0.82rem;
          color: #718096;
          max-width: 540px;
        }

        .ad-live-visual-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ad-mockup-banner {
          height: 145px;
          border-radius: 10px;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 14px 18px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .ad-mockup-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
        }

        .ad-mockup-tag {
          font-size: 0.65rem;
          font-weight: 800;
          color: #86EFAC;
          text-transform: uppercase;
        }

        .ad-mockup-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        .ad-mockup-btn {
          background-color: #22C55E;
          color: #062819;
          padding: 6px 14px;
          font-size: 0.78rem;
          font-weight: 800;
          border-radius: 6px;
        }

        .ad-meta-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          background: #F8FAFC;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }

        .meta-info-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-lbl {
          font-size: 0.72rem;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
        }

        .meta-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1A202C;
        }

        .meta-val-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #075437;
          text-decoration: underline;
        }

        .badge-success {
          background: #DEF7EC;
          color: #03543F;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
          width: fit-content;
        }

        .badge-inactive {
          background: #FDE8E8;
          color: #9B1C1C;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
          width: fit-content;
        }

        /* CATEGORY BANNERS */
        .category-banners-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cat-banner-row-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cat-banner-img-preview {
          width: 140px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          background: #F7FAFC;
          flex-shrink: 0;
        }

        .cat-banner-img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-banner-details {
          flex: 1;
        }

        .cat-header-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .cat-header-title-row h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1A202C;
          margin: 0;
        }

        .route-tag {
          font-size: 0.72rem;
          font-weight: 700;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .cat-tagline-text,
        .cat-promo-text {
          font-size: 0.78rem;
          color: #4A5568;
          margin-bottom: 2px;
        }

        .action-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          color: #075437;
          border: 1px solid #075437;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .action-btn-outline:hover {
          background: #EFF8F4;
        }

        /* MODALS */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .modal-card {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1A202C;
          margin: 0;
        }

        .modal-close {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          color: #718096;
          cursor: pointer;
        }

        .modal-body-form {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #2D3748;
        }

        .form-input,
        .form-select {
          padding: 8px 12px;
          border: 1px solid #CBD5E0;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #1A202C;
          outline: none;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #075437;
        }

        .input-with-icon-left {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-left {
          position: absolute;
          left: 10px;
          color: #718096;
          pointer-events: none;
        }

        .input-with-icon-left .form-input {
          padding-left: 32px;
          width: 100%;
        }

        .form-hint {
          font-size: 0.72rem;
          color: #718096;
          margin-top: 2px;
        }

        .form-hint code {
          background: #EDF2F7;
          padding: 1px 4px;
          border-radius: 3px;
        }

        .file-input {
          font-size: 0.8rem;
          color: #4A5568;
        }

        .uploading-text {
          font-size: 0.74rem;
          color: #075437;
          font-weight: 700;
        }

        .image-live-preview {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #718096;
        }

        .preview-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
        }

        .checkbox-group {
          margin-top: 4px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #2D3748;
          cursor: pointer;
        }

        .modal-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px solid #E2E8F0;
        }

        .action-btn-cancel {
          background: #EDF2F7;
          color: #4A5568;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BannersManager;
