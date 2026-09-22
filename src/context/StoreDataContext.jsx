import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BRAND_INFO,
  CATEGORIES as INITIAL_CATEGORIES,
  PRODUCTS as INITIAL_PRODUCTS,
  HERO_BANNERS as INITIAL_HERO_BANNERS
} from '../data/products';
import { supabase, SupabaseDB } from '../lib/supabaseClient';

const StoreDataContext = createContext();

const INITIAL_CATEGORY_BANNERS = [
  {
    categoryId: 'chicken',
    categoryName: 'Fresh Chicken',
    bannerImage: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80',
    tagline: '100% Antibiotic-free & ethically raised farm chicken',
    promoText: 'Daily fresh butchery • Vacuum sealed'
  },
  {
    categoryId: 'mutton',
    categoryName: 'Prime Mutton',
    bannerImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Tender pasture-raised grass-fed goat meat cuts',
    promoText: 'Artisanal hand-trimmed • Zero hormones'
  },
  {
    categoryId: 'seafood',
    categoryName: 'Fresh Seafood',
    bannerImage: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Coastal daily morning catch, cleaned and deveined',
    promoText: 'Chemical-free • Net cookable weight'
  }
];

const INITIAL_COUPONS = [
  {
    id: 'c-01',
    code: 'FRESH100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 499,
    description: 'Flat ₹100 off on your first order above ₹499',
    expiresAt: '2026-12-31',
    isActive: true,
    usedCount: 42
  },
  {
    id: 'c-02',
    code: 'MADHUR20',
    discountType: 'percent',
    discountValue: 20,
    minOrderValue: 799,
    description: '20% off up to ₹200 on orders above ₹799',
    expiresAt: '2026-11-30',
    isActive: true,
    usedCount: 88
  },
  {
    id: 'c-03',
    code: 'WEEKEND50',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 399,
    description: 'Flat ₹50 off on weekend meat orders',
    expiresAt: '2026-10-31',
    isActive: false,
    usedCount: 19
  }
];

const generateInitialInventory = (productsList) => {
  const stockMap = {};
  productsList.forEach((prod) => {
    prod.weights?.forEach((w) => {
      const key = `${prod.id}_${w.id}`;
      stockMap[key] = {
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        weightId: w.id,
        weightLabel: w.label,
        price: w.price,
        stockCount: 25,
        minThreshold: 8,
        inStock: true
      };
    });
  });
  return stockMap;
};

export const StoreDataProvider = ({ children }) => {
  // 1. Products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 3. Hero Banners
  const [heroBanners, setHeroBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_hero_banners');
      return saved ? JSON.parse(saved) : INITIAL_HERO_BANNERS;
    } catch {
      return INITIAL_HERO_BANNERS;
    }
  });

  // 4. Category Page Banners
  const [categoryBanners, setCategoryBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_category_banners');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORY_BANNERS;
    } catch {
      return INITIAL_CATEGORY_BANNERS;
    }
  });

  // 5. Coupons
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // 6. Inventory Stock Map
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_inventory');
      return saved ? JSON.parse(saved) : generateInitialInventory(INITIAL_PRODUCTS);
    } catch {
      return generateInitialInventory(INITIAL_PRODUCTS);
    }
  });

  // 7. Store Settings
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('madurfresh_settings');
      return saved ? JSON.parse(saved) : {
        ...BRAND_INFO,
        isOpen: true,
        openingTime: '06:30 AM',
        closingTime: '10:00 PM',
        deliveryRadius: '12 km',
        minimumOrderAmount: 149,
        announcementText: '⚡ Fast 45-min delivery across Bangalore'
      };
    } catch {
      return {
        ...BRAND_INFO,
        isOpen: true,
        openingTime: '06:30 AM',
        closingTime: '10:00 PM',
        deliveryRadius: '12 km',
        minimumOrderAmount: 149,
        announcementText: '⚡ Fast 45-min delivery across Bangalore'
      };
    }
  });

  // Initial Supabase Sync on Mount
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const [
          remoteProducts,
          remoteCategories,
          remoteHeroBanners,
          remoteCategoryBanners,
          remoteCoupons
        ] = await Promise.allSettled([
          SupabaseDB.fetchTable('products', products),
          SupabaseDB.fetchTable('categories', categories),
          SupabaseDB.fetchTable('hero_banners', heroBanners),
          SupabaseDB.fetchTable('category_banners', categoryBanners),
          SupabaseDB.fetchTable('coupons', coupons)
        ]);

        if (remoteProducts.status === 'fulfilled' && remoteProducts.value?.length > 0) {
          setProducts(remoteProducts.value);
        }
        if (remoteCategories.status === 'fulfilled' && remoteCategories.value?.length > 0) {
          setCategories(remoteCategories.value);
        }
        if (remoteHeroBanners.status === 'fulfilled' && remoteHeroBanners.value?.length > 0) {
          setHeroBanners(remoteHeroBanners.value);
        }
        if (remoteCategoryBanners.status === 'fulfilled' && remoteCategoryBanners.value?.length > 0) {
          setCategoryBanners(remoteCategoryBanners.value);
        }
        if (remoteCoupons.status === 'fulfilled' && remoteCoupons.value?.length > 0) {
          setCoupons(remoteCoupons.value);
        }
      } catch (e) {
        console.warn('Initial Supabase fetch skipped, using local cache', e);
      }
    }

    loadFromSupabase();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_hero_banners', JSON.stringify(heroBanners));
    } catch (e) {
      console.error('Failed to save hero banners', e);
    }
  }, [heroBanners]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_category_banners', JSON.stringify(categoryBanners));
    } catch (e) {
      console.error('Failed to save category banners', e);
    }
  }, [categoryBanners]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error('Failed to save coupons', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to save inventory', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('madurfresh_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error('Failed to save store settings', e);
    }
  }, [storeSettings]);

  // Product Actions with Supabase Sync
  const addProduct = (productData) => {
    const newId = `mf-prod-${Date.now().toString().slice(-5)}`;
    const slug = (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = {
      ...productData,
      id: newId,
      slug: slug || newId,
      rating: 4.8,
      reviewCount: 1,
      availability: true
    };

    setProducts(prev => [newProduct, ...prev]);
    SupabaseDB.upsertRecord('products', newProduct);

    // Initialize inventory for this product
    setInventory(prev => {
      const updated = { ...prev };
      newProduct.weights?.forEach(w => {
        const key = `${newId}_${w.id}`;
        updated[key] = {
          productId: newId,
          productName: newProduct.name,
          category: newProduct.category,
          weightId: w.id,
          weightLabel: w.label,
          price: w.price,
          stockCount: 20,
          minThreshold: 5,
          inStock: true
        };
      });
      return updated;
    });

    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === productId ? { ...p, ...updatedData } : p));
      const target = updated.find(p => p.id === productId);
      if (target) SupabaseDB.upsertRecord('products', target);
      return updated;
    });
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    SupabaseDB.deleteRecord('products', 'id', productId);
  };

  const toggleProductStatus = (productId) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === productId ? { ...p, availability: !p.availability } : p));
      const target = updated.find(p => p.id === productId);
      if (target) SupabaseDB.upsertRecord('products', target);
      return updated;
    });
  };

  // Category Actions with Supabase Sync
  const addCategory = (categoryData) => {
    const id = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = { ...categoryData, id };
    setCategories(prev => [...prev, newCategory]);
    SupabaseDB.upsertRecord('categories', newCategory);
    return newCategory;
  };

  const updateCategory = (categoryId, updatedData) => {
    setCategories(prev => {
      const updated = prev.map(c => (c.id === categoryId ? { ...c, ...updatedData } : c));
      const target = updated.find(c => c.id === categoryId);
      if (target) SupabaseDB.upsertRecord('categories', target);
      return updated;
    });
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    SupabaseDB.deleteRecord('categories', 'id', categoryId);
  };

  // Banner Actions with Supabase Sync
  const addHeroBanner = (bannerData) => {
    const newBanner = { ...bannerData, id: Date.now() };
    setHeroBanners(prev => [...prev, newBanner]);
    SupabaseDB.upsertRecord('hero_banners', newBanner);
  };

  const updateHeroBanner = (bannerId, updatedData) => {
    setHeroBanners(prev => {
      const updated = prev.map(b => (b.id === bannerId ? { ...b, ...updatedData } : b));
      const target = updated.find(b => b.id === bannerId);
      if (target) SupabaseDB.upsertRecord('hero_banners', target);
      return updated;
    });
  };

  const deleteHeroBanner = (bannerId) => {
    setHeroBanners(prev => prev.filter(b => b.id !== bannerId));
    SupabaseDB.deleteRecord('hero_banners', 'id', bannerId);
  };

  const updateCategoryBanner = (categoryId, updatedData) => {
    setCategoryBanners(prev => {
      const exists = prev.some(cb => cb.categoryId === categoryId);
      let updated;
      if (exists) {
        updated = prev.map(cb => (cb.categoryId === categoryId ? { ...cb, ...updatedData } : cb));
      } else {
        updated = [...prev, { categoryId, ...updatedData }];
      }
      const target = updated.find(cb => cb.categoryId === categoryId);
      if (target) SupabaseDB.upsertRecord('category_banners', target);
      return updated;
    });
  };

  // Inventory Stock Actions
  const updateStock = (productId, weightId, newCount) => {
    const key = `${productId}_${weightId}`;
    setInventory(prev => {
      const current = prev[key] || {};
      const updatedCount = Math.max(0, parseInt(newCount, 10) || 0);
      return {
        ...prev,
        [key]: {
          ...current,
          stockCount: updatedCount,
          inStock: updatedCount > 0
        }
      };
    });
  };

  // Coupon Actions with Supabase Sync
  const addCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: `c-${Date.now().toString().slice(-4)}`,
      usedCount: 0,
      isActive: true
    };
    setCoupons(prev => [newCoupon, ...prev]);
    SupabaseDB.upsertRecord('coupons', newCoupon);
  };

  const updateCoupon = (couponId, updatedData) => {
    setCoupons(prev => {
      const updated = prev.map(c => (c.id === couponId ? { ...c, ...updatedData } : c));
      const target = updated.find(c => c.id === couponId);
      if (target) SupabaseDB.upsertRecord('coupons', target);
      return updated;
    });
  };

  const deleteCoupon = (couponId) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    SupabaseDB.deleteRecord('coupons', 'id', couponId);
  };

  const toggleCouponStatus = (couponId) => {
    setCoupons(prev => {
      const updated = prev.map(c => (c.id === couponId ? { ...c, isActive: !c.isActive } : c));
      const target = updated.find(c => c.id === couponId);
      if (target) SupabaseDB.upsertRecord('coupons', target);
      return updated;
    });
  };

  // Settings Action with Supabase Sync
  const updateSettings = (newSettings) => {
    setStoreSettings(prev => {
      const updated = { ...prev, ...newSettings };
      SupabaseDB.upsertRecord('store_settings', { id: 'main_settings', settings: updated });
      return updated;
    });
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        categories,
        heroBanners,
        categoryBanners,
        coupons,
        inventory,
        storeSettings,
        // Product Methods
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        // Category Methods
        addCategory,
        updateCategory,
        deleteCategory,
        // Banner Methods
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        updateCategoryBanner,
        // Inventory Methods
        updateStock,
        // Coupon Methods
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        // Settings Methods
        updateSettings
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => useContext(StoreDataContext);
