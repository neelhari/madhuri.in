import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://petqlasrhpnvojwluclo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rJfwQeChMM0BZkRbRN82Qg_qxIGS3Wf';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SQL Schema Reference for Supabase (if tables are created in Supabase SQL editor):
 * 
 * CREATE TABLE IF NOT EXISTS products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT,
 *   slug TEXT,
 *   category TEXT,
 *   categoryName TEXT,
 *   rating NUMERIC,
 *   reviewCount INTEGER,
 *   shortDescription TEXT,
 *   description TEXT,
 *   images JSONB,
 *   weights JSONB,
 *   freshnessInfo TEXT,
 *   handling TEXT,
 *   cookingRecommendation TEXT,
 *   availability BOOLEAN,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE TABLE IF NOT EXISTS categories (
 *   id TEXT PRIMARY KEY,
 *   name TEXT,
 *   tagline TEXT,
 *   image TEXT,
 *   description TEXT
 * );
 * 
 * CREATE TABLE IF NOT EXISTS hero_banners (
 *   id BIGINT PRIMARY KEY,
 *   title TEXT,
 *   category TEXT,
 *   image TEXT
 * );
 * 
 * CREATE TABLE IF NOT EXISTS category_banners (
 *   categoryId TEXT PRIMARY KEY,
 *   categoryName TEXT,
 *   bannerImage TEXT,
 *   tagline TEXT,
 *   promoText TEXT
 * );
 * 
 * CREATE TABLE IF NOT EXISTS coupons (
 *   id TEXT PRIMARY KEY,
 *   code TEXT UNIQUE,
 *   discountType TEXT,
 *   discountValue NUMERIC,
 *   minOrderValue NUMERIC,
 *   description TEXT,
 *   expiresAt TEXT,
 *   isActive BOOLEAN,
 *   usedCount INTEGER
 * );
 * 
 * CREATE TABLE IF NOT EXISTS orders (
 *   id TEXT PRIMARY KEY,
 *   createdAt TEXT,
 *   status TEXT,
 *   statusCode INTEGER,
 *   estimatedDelivery TEXT,
 *   address JSONB,
 *   items JSONB,
 *   summary JSONB,
 *   paymentMethod TEXT,
 *   paymentStatus TEXT
 * );
 * 
 * CREATE TABLE IF NOT EXISTS store_settings (
 *   id TEXT PRIMARY KEY DEFAULT 'main_settings',
 *   settings JSONB
 * );
 */

export const SupabaseDB = {
  // Generic Fetch with Fallback
  async fetchTable(tableName, fallbackData) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error || !data || data.length === 0) {
        return fallbackData;
      }
      return data;
    } catch (err) {
      console.warn(`Supabase ${tableName} fetch error, using local state:`, err);
      return fallbackData;
    }
  },

  // Upsert Record
  async upsertRecord(tableName, record) {
    try {
      const { data, error } = await supabase.from(tableName).upsert(record);
      if (error) {
        console.warn(`Supabase ${tableName} upsert failed (will persist locally):`, error.message);
      }
      return { data, error };
    } catch (err) {
      console.warn(`Supabase ${tableName} network error:`, err);
      return { error: err };
    }
  },

  // Delete Record
  async deleteRecord(tableName, primaryKey, value) {
    try {
      const { data, error } = await supabase.from(tableName).delete().eq(primaryKey, value);
      return { data, error };
    } catch (err) {
      console.warn(`Supabase ${tableName} delete error:`, err);
      return { error: err };
    }
  }
};
