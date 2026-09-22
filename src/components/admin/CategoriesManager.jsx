import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  FolderTree,
  Package,
  Layers
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const CategoriesManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } =
    useStoreData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    image: '',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      tagline: '',
      image: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      tagline: category.tagline || '',
      image: category.image || '',
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    setIsModalOpen(false);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadToCloudinary(file, { folder: 'madhurfresh/categories' });
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert('Cloudinary upload failed: ' + (err.message || 'Please check your connection'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="categories-manager-container">
      {/* Header Bar */}
      <div className="cat-header-row">
        <div className="cat-count-badge">
          <Layers size={16} color="#075437" />
          <span>{categories.length} Categories Total</span>
        </div>

        <button
          type="button"
          className="action-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((category) => {
          const categoryProductCount = products.filter(
            (p) => p.category === category.id
          ).length;

          return (
            <div key={category.id} className="category-admin-card">
              <div className="category-img-header">
                <img
                  src={category.image}
                  alt={category.name}
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span className="category-id-badge">ID: {category.id}</span>
                <span className="category-prod-count">
                  <Package size={13} /> {categoryProductCount} Products
                </span>
              </div>

              <div className="category-card-content">
                <div className="category-name-row">
                  <h3 className="category-title">{category.name}</h3>
                  <span className="category-tagline-chip">
                    {category.tagline || 'Fresh'}
                  </span>
                </div>

                <p className="category-desc-text">
                  {category.description || 'No description added yet.'}
                </p>

                <div className="category-card-actions">
                  <button
                    type="button"
                    className="action-btn-edit"
                    onClick={() => handleOpenEdit(category)}
                  >
                    <Edit2 size={14} />
                    <span>Edit Category</span>
                  </button>
                  <button
                    type="button"
                    className="action-btn-delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete category "${category.name}"?`
                        )
                      ) {
                        deleteCategory(category.id);
                      }
                    }}
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fresh Chicken, Prime Mutton, Fresh Seafood"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Tagline</label>
                <select
                  className="form-select"
                  value={formData.tagline || 'Fresh cuts'}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                >
                  <option value="Fresh cuts">Fresh cuts (Poultry / Chicken)</option>
                  <option value="Premium cuts">Premium cuts (Mutton / Goat)</option>
                  <option value="Fresh catch">Fresh catch (Fish & Seafood)</option>
                  <option value="Artisanal cuts">Artisanal cuts (Gourmet & Speciality)</option>
                  <option value="Daily farm sourced">Daily farm sourced</option>
                  <option value="100% Antibiotic-free">100% Antibiotic-free</option>
                  <option value="Tender & Juicy">Tender & Juicy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </div>

              {formData.image && (
                <div className="image-live-preview">
                  <span className="preview-label">Image Preview:</span>
                  <img
                    src={formData.image}
                    alt="Category Preview"
                    className="preview-img"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Brief description about the meat/seafood quality and hygiene..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
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
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .categories-manager-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cat-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
        }

        .cat-count-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #2D3748;
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

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .category-admin-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .category-img-header {
          position: relative;
          height: 160px;
          background: #EDF2F7;
        }

        .category-img-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-id-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.65);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          font-family: monospace;
        }

        .category-prod-count {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #075437;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .category-card-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .category-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1A202C;
        }

        .category-tagline-chip {
          font-size: 0.72rem;
          font-weight: 700;
          background: #EFF8F4;
          color: #075437;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .category-desc-text {
          font-size: 0.82rem;
          color: #4A5568;
          line-height: 1.4;
          flex: 1;
        }

        .category-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #EDF2F7;
        }

        .action-btn-edit {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F7FAFC;
          color: #075437;
          border: 1px solid #E2E8F0;
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.15s ease;
          flex: 1;
          justify-content: center;
        }

        .action-btn-edit:hover {
          background: #EFF8F4;
          border-color: #075437;
        }

        .action-btn-delete {
          padding: 7px 10px;
          border-radius: 6px;
          border: 1px solid #FEB2B2;
          background: #FFF5F5;
          color: #C53030;
          cursor: pointer;
        }

        .action-btn-delete:hover {
          background: #FED7D7;
        }

        /* Modal */
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
          max-width: 480px;
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
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
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

        .form-input, .form-textarea {
          padding: 10px 14px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
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
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
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
      `}</style>
    </div>
  );
};
