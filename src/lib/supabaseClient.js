import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://petqlasrhpnvojwluclo.supabase.co';
// Use secret key if available for administrative permissions, fallback to anon key
const supabaseKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_SECRET_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY)) || 'sb_publishable_rJfwQeChMM0BZkRbRN82Qg_qxIGS3Wf';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Normalizes Javascript camelCase objects to Postgres lowercase column names.
 */
function toPostgresPayload(tableName, record) {
  if (!record || typeof record !== 'object') return record;

  if (tableName === 'products') {
    return {
      id: record.id,
      name: record.name,
      slug: record.slug || record.id,
      category: record.category,
      categoryname: record.categoryName || record.categoryname || '',
      rating: record.rating !== undefined ? record.rating : 4.8,
      reviewcount: record.reviewCount !== undefined ? record.reviewCount : record.reviewcount || 0,
      shortdescription: record.shortDescription || record.shortdescription || '',
      description: record.description || '',
      images: record.images || [],
      weights: record.weights || [],
      freshnessinfo: record.freshnessInfo || record.freshnessinfo || '',
      handling: record.handling || '',
      cookingrecommendation: record.cookingRecommendation || record.cookingrecommendation || '',
      availability: record.availability !== false
    };
  }

  if (tableName === 'category_banners') {
    return {
      categoryid: record.categoryId || record.categoryid,
      categoryname: record.categoryName || record.categoryname || '',
      bannerimage: record.bannerImage || record.bannerimage || '',
      tagline: record.tagline || '',
      promotext: record.promoText || record.promotext || ''
    };
  }

  if (tableName === 'coupons') {
    return {
      id: record.id,
      code: record.code,
      discounttype: record.discountType || record.discounttype || 'flat',
      discountvalue: record.discountValue !== undefined ? record.discountValue : record.discountvalue,
      minordervalue: record.minOrderValue !== undefined ? record.minOrderValue : record.minordervalue,
      description: record.description || '',
      expiresat: record.expiresAt || record.expiresat || '',
      isactive: record.isActive !== undefined ? record.isActive : record.isactive !== false,
      usedcount: record.usedCount !== undefined ? record.usedCount : record.usedcount || 0
    };
  }

  return record;
}

/**
 * Normalizes Postgres lowercase rows back to Javascript camelCase properties.
 */
function fromPostgresRow(tableName, row) {
  if (!row || typeof row !== 'object') return row;

  if (tableName === 'products') {
    return {
      ...row,
      categoryName: row.categoryname || row.categoryName || '',
      shortDescription: row.shortdescription || row.shortDescription || '',
      reviewCount: row.reviewcount !== undefined ? row.reviewcount : row.reviewCount || 0,
      freshnessInfo: row.freshnessinfo || row.freshnessInfo || '',
      cookingRecommendation: row.cookingrecommendation || row.cookingRecommendation || ''
    };
  }

  if (tableName === 'category_banners') {
    return {
      ...row,
      categoryId: row.categoryid || row.categoryId,
      categoryName: row.categoryname || row.categoryName || '',
      bannerImage: row.bannerimage || row.bannerImage || '',
      promoText: row.promotext || row.promoText || ''
    };
  }

  if (tableName === 'coupons') {
    return {
      ...row,
      discountType: row.discounttype || row.discountType || 'flat',
      discountValue: row.discountvalue !== undefined ? row.discountvalue : row.discountValue,
      minOrderValue: row.minordervalue !== undefined ? row.minordervalue : row.minOrderValue,
      expiresAt: row.expiresat || row.expiresAt || '',
      isActive: row.isactive !== undefined ? row.isactive : row.isActive !== false,
      usedCount: row.usedcount !== undefined ? row.usedcount : row.usedCount || 0
    };
  }

  if (tableName === 'store_settings') {
    return {
      ...row,
      deliveryTime: row.deliverytime || row.deliveryTime,
      freeDeliveryThreshold: row.freedeliverythreshold !== undefined ? row.freedeliverythreshold : row.freeDeliveryThreshold,
      deliveryFee: row.deliveryfee !== undefined ? row.deliveryfee : row.deliveryFee,
      minimumOrderAmount: row.minimumorderamount !== undefined ? row.minimumorderamount : row.minimumOrderAmount,
      isOpen: row.isopen !== undefined ? row.isopen : row.isOpen,
      openingTime: row.openingtime || row.openingTime,
      closingTime: row.closingtime || row.closingTime,
      announcementText: row.announcementtext || row.announcementText
    };
  }

  return row;
}

export const SupabaseDB = {
  // Generic Fetch with Automatic Schema Normalization
  async fetchTable(tableName, fallbackData) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error || !data || data.length === 0) {
        if (error) console.warn(`Supabase ${tableName} fetch error:`, error.message);
        return fallbackData;
      }
      return data.map((row) => fromPostgresRow(tableName, row));
    } catch (err) {
      console.warn(`Supabase ${tableName} network error, using local state:`, err);
      return fallbackData;
    }
  },

  // Upsert Record with Automatic Postgres Mapping
  async upsertRecord(tableName, record) {
    try {
      const payload = toPostgresPayload(tableName, record);
      const { data, error } = await supabase.from(tableName).upsert(payload);
      if (error) {
        console.error(`Supabase ${tableName} upsert error:`, error.message);
      } else {
        console.log(`Supabase ${tableName} saved successfully:`, record.id || record.categoryId || record.code);
      }
      return { data, error };
    } catch (err) {
      console.error(`Supabase ${tableName} upsert exception:`, err);
      return { error: err };
    }
  },

  // Delete Record
  async deleteRecord(tableName, primaryKey, value) {
    try {
      // Lowercase primary key if needed (e.g. categoryId -> categoryid)
      const pk = primaryKey.toLowerCase();
      const { data, error } = await supabase.from(tableName).delete().eq(pk, value);
      if (error) {
        console.error(`Supabase ${tableName} delete error:`, error.message);
      }
      return { data, error };
    } catch (err) {
      console.error(`Supabase ${tableName} delete exception:`, err);
      return { error: err };
    }
  }
};
