-- ==============================================================================
-- MADHUR FRESH - COMPLETE SUPABASE CLOUD DATABASE SCHEMA & SEED DATA
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/petqlasrhpnvojwluclo/sql
-- ==============================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  category TEXT REFERENCES categories(id) ON DELETE SET NULL,
  categoryName TEXT,
  rating NUMERIC DEFAULT 4.8,
  reviewCount INTEGER DEFAULT 0,
  shortDescription TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  weights JSONB DEFAULT '[]'::jsonb,
  freshnessInfo TEXT,
  handling TEXT,
  cookingRecommendation TEXT,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HERO BANNERS TABLE (Homepage Slides)
CREATE TABLE IF NOT EXISTS hero_banners (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CATEGORY HEADER BANNERS TABLE
CREATE TABLE IF NOT EXISTS category_banners (
  categoryId TEXT PRIMARY KEY,
  categoryName TEXT NOT NULL,
  bannerImage TEXT NOT NULL,
  tagline TEXT,
  promoText TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discountType TEXT DEFAULT 'flat',
  discountValue NUMERIC DEFAULT 0,
  minOrderValue NUMERIC DEFAULT 0,
  description TEXT,
  expiresAt TEXT,
  isActive BOOLEAN DEFAULT true,
  usedCount INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INVENTORY STOCK TABLE
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY, -- format: {productId}_{weightId}
  productId TEXT REFERENCES products(id) ON DELETE CASCADE,
  productName TEXT,
  category TEXT,
  weightId TEXT,
  weightLabel TEXT,
  price NUMERIC,
  stockCount INTEGER DEFAULT 25,
  minThreshold INTEGER DEFAULT 8,
  inStock BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  createdAt TEXT,
  status TEXT DEFAULT 'Placed',
  statusCode INTEGER DEFAULT 1,
  estimatedDelivery TEXT,
  address JSONB,
  items JSONB,
  summary JSONB,
  paymentMethod TEXT,
  paymentStatus TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  name TEXT DEFAULT 'MadhurFresh',
  tagline TEXT DEFAULT 'The Quality Choice',
  owner TEXT DEFAULT 'Sindhusha G',
  phone TEXT DEFAULT '+91 98765 43210',
  whatsapp TEXT DEFAULT '919876543210',
  email TEXT DEFAULT 'care@madurfresh.in',
  deliveryTime TEXT DEFAULT 'Express (45-60 mins)',
  freeDeliveryThreshold NUMERIC DEFAULT 499,
  deliveryFee NUMERIC DEFAULT 39,
  minimumOrderAmount NUMERIC DEFAULT 149,
  isOpen BOOLEAN DEFAULT true,
  openingTime TEXT DEFAULT '06:30 AM',
  closingTime TEXT DEFAULT '10:00 PM',
  announcementText TEXT DEFAULT '⚡ Fast 45-min delivery across Bangalore',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ADMIN CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY DEFAULT 'admin-1',
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables and grant full read/write to anon and authenticated clients
-- ==============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access categories" ON categories;
DROP POLICY IF EXISTS "Public access products" ON products;
DROP POLICY IF EXISTS "Public access hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Public access category_banners" ON category_banners;
DROP POLICY IF EXISTS "Public access coupons" ON coupons;
DROP POLICY IF EXISTS "Public access inventory" ON inventory;
DROP POLICY IF EXISTS "Public access orders" ON orders;
DROP POLICY IF EXISTS "Public access store_settings" ON store_settings;
DROP POLICY IF EXISTS "Public access admin_users" ON admin_users;

CREATE POLICY "Public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access hero_banners" ON hero_banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access category_banners" ON category_banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access store_settings" ON store_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED INITIAL STORE DATA DIRECTLY INTO SUPABASE
-- ==============================================================================

-- Seed Categories
INSERT INTO categories (id, name, tagline, image, description)
VALUES 
  ('chicken', 'Fresh Chicken', 'Fresh cuts', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80', '100% antibiotic-free, naturally raised poultry cuts cleaned with RO water and vacuum sealed.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image;

INSERT INTO categories (id, name, tagline, image, description)
VALUES 
  ('mutton', 'Prime Mutton', 'Premium cuts', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80', 'Pasture-raised, hormone-free tender goat meat expertly hand-trimmed for optimum flavor and texture.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image;

INSERT INTO categories (id, name, tagline, image, description)
VALUES 
  ('seafood', 'Fresh Seafood', 'Fresh catch', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80', 'Fresh day-catch seafood, thoroughly cleaned and deveined with zero chemical preservatives.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image;

-- Seed Products
INSERT INTO products (id, slug, name, category, categoryName, rating, reviewCount, shortDescription, description, images, weights, freshnessInfo, handling, cookingRecommendation, availability)
VALUES 
  (
    'mf-chk-01',
    'farm-fresh-chicken-curry-cut',
    'Fresh Chicken Curry Cut',
    'chicken',
    'Fresh Chicken',
    4.8,
    142,
    'Tender farm-raised chicken cut into curry-sized pieces. 100% antibiotic-free.',
    'Our Farm Fresh Chicken Curry Cut is crafted for everyday culinary perfection. Sourced from biosecure farms without antibiotics or growth promoters. Every piece is cleaned with purified RO water and pre-cut into bone-in and tender boneless pieces, vacuum sealed at 0-4°C.',
    '["https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80"]'::jsonb,
    '[{"id": "w-500g", "label": "500 g", "price": 175, "originalPrice": 220, "discount": 20, "netWeight": "500g (Net 480-500g)", "serves": "2-3 people"}, {"id": "w-1kg", "label": "1 kg", "price": 330, "originalPrice": 420, "discount": 21, "netWeight": "1000g (Net 980-1000g)", "serves": "4-5 people"}]'::jsonb,
    'Chilled at 0-4°C, Never Frozen, Daily Farm Sourced',
    'Cleaned with RO water, vacuum sealed for peak freshness',
    'Ideal for rich homestyle curries, pepper chicken, and slow stews.',
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, slug, name, category, categoryName, rating, reviewCount, shortDescription, description, images, weights, freshnessInfo, handling, cookingRecommendation, availability)
VALUES 
  (
    'mf-chk-02',
    'tender-boneless-chicken-breast',
    'Tender Boneless Chicken Breast',
    'chicken',
    'Fresh Chicken',
    4.9,
    98,
    'Trimmed, skinless chicken breast fillets packed with lean protein. Juicy and tender.',
    'Pure, lean protein fillets expertly trimmed to remove all excess fat. Sourced from young, tender chickens for that juicy, melt-in-mouth texture when cooked. Perfect for health enthusiasts, fitness regimes, and gourmet pan-seared preparations.',
    '["https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80"]'::jsonb,
    '[{"id": "w-500g", "label": "500 g", "price": 230, "originalPrice": 280, "discount": 18, "netWeight": "500g (2-3 fillets)", "serves": "2-3 people"}, {"id": "w-1kg", "label": "1 kg", "price": 440, "originalPrice": 550, "discount": 20, "netWeight": "1000g (4-6 fillets)", "serves": "4-5 people"}]'::jsonb,
    'Antibiotic-residue free, 100% vegetarian-fed poultry',
    'Hand-filleted by master butchers, vacuum packed',
    'Best for pan-searing, grilling, meal-prep bowls, salads, and stir-fries.',
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, slug, name, category, categoryName, rating, reviewCount, shortDescription, description, images, weights, freshnessInfo, handling, cookingRecommendation, availability)
VALUES 
  (
    'mf-mut-01',
    'rich-mutton-curry-cut',
    'Rich Mutton Curry Cut',
    'mutton',
    'Prime Mutton',
    4.9,
    184,
    'Prime cuts of pasture-raised tender goat meat including ribs, shoulder, and shank.',
    'Experience authentic flavor with our Premium Mutton Curry Cut. We select only naturally grazed, young, healthy goats to ensure that tender, sweet meat profile. Evenly apportioned with bone-in cuts and marrow pieces that impart rich depth to traditional gravies.',
    '["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"]'::jsonb,
    '[{"id": "w-500g", "label": "500 g", "price": 490, "originalPrice": 580, "discount": 15, "netWeight": "500g (10-12 pieces)", "serves": "2-3 people"}, {"id": "w-1kg", "label": "1 kg", "price": 950, "originalPrice": 1150, "discount": 17, "netWeight": "1000g (20-24 pieces)", "serves": "4-6 people"}]'::jsonb,
    'Naturally grazed, hormone-free, ethically sourced',
    'Artisanal hand-cut, fat-trimmed, washed in RO water',
    'Best for slow-simmered Rogan Josh, Nihari, and rich biryanis.',
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, slug, name, category, categoryName, rating, reviewCount, shortDescription, description, images, weights, freshnessInfo, handling, cookingRecommendation, availability)
VALUES 
  (
    'mf-mut-02',
    'prime-boneless-mutton-boti',
    'Prime Boneless Mutton Boti',
    'mutton',
    'Prime Mutton',
    4.8,
    76,
    'Hand-trimmed, bite-sized boneless goat meat pieces without excess fat or sinew.',
    'Our artisanal Boneless Mutton Boti is carefully carved from the prime leg and shoulder portions of tender goats. Completely boneless, free of tough tendon tissue, and diced into uniform morsels that absorb marinades and spices with ease.',
    '["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80"]'::jsonb,
    '[{"id": "w-500g", "label": "500 g", "price": 580, "originalPrice": 690, "discount": 16, "netWeight": "500g (Boneless)", "serves": "2-3 people"}, {"id": "w-1kg", "label": "1 kg", "price": 1120, "originalPrice": 1350, "discount": 17, "netWeight": "1000g (Boneless)", "serves": "4-5 people"}]'::jsonb,
    'Strictly selected younger goats for maximum tenderness',
    '100% boneless, clean-cut, zero water weight added',
    'Ideal for Lucknowi Dum Biryani, Mutton Sukka, and Boti Kebabs.',
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, slug, name, category, categoryName, rating, reviewCount, shortDescription, description, images, weights, freshnessInfo, handling, cookingRecommendation, availability)
VALUES 
  (
    'mf-sea-01',
    'fresh-white-prawns-cleaned-deveined',
    'Fresh White Prawns (Cleaned)',
    'seafood',
    'Fresh Seafood',
    4.9,
    115,
    'Coastal white prawns with tail-on, peeled, cleaned, and deveined. Naturally sweet.',
    'Sourced directly from daily coastal catches, our medium-large White Prawns arrive fresh at your doorstep. Each prawn is carefully peeled and deveined by hand, leaving the tail-on for elegant presentation. We weigh after cleaning so you pay only for pure, cookable seafood.',
    '["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80"]'::jsonb,
    '[{"id": "w-250g", "label": "250 g", "price": 260, "originalPrice": 320, "discount": 19, "netWeight": "250g (15-20 pcs)", "serves": "1-2 people"}, {"id": "w-500g", "label": "500 g", "price": 499, "originalPrice": 620, "discount": 20, "netWeight": "500g (30-40 pcs)", "serves": "2-3 people"}, {"id": "w-1kg", "label": "1 kg", "price": 960, "originalPrice": 1200, "discount": 20, "netWeight": "1000g (60-80 pcs)", "serves": "4-6 people"}]'::jsonb,
    'Direct from coastal harbors, zero formalin or chemicals',
    'Net weight guaranteed after 100% deveining and peeling',
    'Cooks in under 5 minutes! Outstanding for butter garlic prawns and Goan curry.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Hero Banners
INSERT INTO hero_banners (id, title, category, image)
VALUES
  (1, 'Farm Fresh Chicken', 'chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80'),
  (2, 'Prime Pasture Mutton', 'mutton', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80'),
  (3, 'Fresh Coastal Seafood', 'seafood', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Category Headers
INSERT INTO category_banners (categoryId, categoryName, bannerImage, tagline, promoText)
VALUES
  ('chicken', 'Fresh Chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80', '100% Antibiotic-free & ethically raised farm chicken', 'Daily fresh butchery • Vacuum sealed'),
  ('mutton', 'Prime Mutton', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80', 'Tender pasture-raised grass-fed goat meat cuts', 'Artisanal hand-trimmed • Zero hormones'),
  ('seafood', 'Fresh Seafood', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80', 'Coastal daily morning catch, cleaned and deveined', 'Chemical-free • Net cookable weight')
ON CONFLICT (categoryId) DO NOTHING;

-- Seed Coupons
INSERT INTO coupons (id, code, discountType, discountValue, minOrderValue, description, expiresAt, isActive, usedCount)
VALUES
  ('c-01', 'FRESH100', 'flat', 100, 499, 'Flat ₹100 off on your first order above ₹499', '2026-12-31', true, 42),
  ('c-02', 'MADHUR20', 'percent', 20, 799, '20% off up to ₹200 on orders above ₹799', '2026-11-30', true, 88),
  ('c-03', 'WEEKEND50', 'flat', 50, 399, 'Flat ₹50 off on weekend meat orders', '2026-10-31', false, 19)
ON CONFLICT (id) DO NOTHING;

-- Seed Store Settings
INSERT INTO store_settings (id, name, tagline, owner, phone, whatsapp, email, deliveryTime, freeDeliveryThreshold, deliveryFee, minimumOrderAmount, isOpen, openingTime, closingTime, announcementText)
VALUES
  ('main_settings', 'MadhurFresh', 'The Quality Choice', 'Sindhusha G', '+91 98765 43210', '919876543210', 'care@madurfresh.in', 'Express (45-60 mins)', 499, 39, 149, true, '06:30 AM', '10:00 PM', '⚡ Fast 45-min delivery across Bangalore')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Admin Account (Change email & password as needed)
INSERT INTO admin_users (id, email, password, role)
VALUES
  ('admin-1', 'admin@madhurfresh.in', 'MadhurFresh@2026', 'admin')
ON CONFLICT (id) DO NOTHING;
