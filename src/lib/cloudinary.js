import { supabase } from './supabaseClient';

const BUCKET_NAME = 'store-assets';

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zoizrivw',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '578956434117562',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'vWX6Xji7Wgys7-wvwvXH2uHyvdY'
};

/**
 * Optimizes image URLs for fast web delivery.
 */
export function getOptimizedCloudinaryUrl(rawUrl, maxWidth = 1000) {
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;
  if (rawUrl.includes('cloudinary.com')) {
    if (rawUrl.includes('/q_auto,f_auto')) return rawUrl;
    return rawUrl.replace('/upload/', `/upload/q_auto,f_auto,w_${maxWidth},c_limit/`);
  }
  return rawUrl;
}

/**
 * Converts a File or Blob into a Base64 Data URL (Used for instant preview and offline fallback)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Primary universal uploader for the entire Admin Panel (Products, Banners, Categories, Settings).
 * Multi-tiered strategy:
 *   1. Supabase Cloud Storage (Fastest, permanent CDN, no signature errors)
 *   2. Base64 fallback (Guarantees admin changes NEVER fail to save)
 *
 * @param {File|Blob|string} fileOrDataUrl - The image file or base64 data to upload
 * @param {Object} options - { folder: 'madhurfresh/products', resourceType: 'image' | 'video' }
 * @returns {Promise<{ url: string, rawUrl: string, publicId: string }>}
 */
export async function uploadToCloudinary(fileOrDataUrl, options = {}) {
  const folder = options.folder || 'madhurfresh';
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');

  try {
    // 1. Prepare File / Blob data
    let uploadPayload = fileOrDataUrl;
    let fileName = 'asset.jpg';
    let contentType = 'image/jpeg';

    if (fileOrDataUrl instanceof File) {
      fileName = fileOrDataUrl.name;
      contentType = fileOrDataUrl.type || 'image/jpeg';
      uploadPayload = fileOrDataUrl;
    } else if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const match = fileOrDataUrl.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        const byteCharacters = atob(match[2]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        uploadPayload = new Blob([byteArray], { type: contentType });
        const ext = contentType.split('/')[1] || 'jpg';
        fileName = `upload_${Date.now()}.${ext}`;
      }
    }

    // 2. Generate clean timestamped path: e.g. "madhurfresh/banners/1727150000_photo.jpg"
    const sanitizedName = (fileName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${cleanFolder}/${Date.now()}_${sanitizedName}`;

    // 3. Attempt direct upload to Supabase Storage
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, uploadPayload, {
        contentType,
        upsert: true
      });

    if (!uploadErr && uploadData) {
      const { data: pubData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (pubData?.publicUrl) {
        return {
          url: pubData.publicUrl,
          rawUrl: pubData.publicUrl,
          publicId: filePath,
          resourceType: 'image'
        };
      }
    }

    // 4. Fallback: If upload has error, return base64 string directly so saving is never blocked
    console.warn('Storage upload encountered error, using optimized base64 fallback:', uploadErr?.message);
    if (fileOrDataUrl instanceof File) {
      const base64 = await fileToBase64(fileOrDataUrl);
      return {
        url: base64,
        rawUrl: base64,
        publicId: `local_${Date.now()}`,
        resourceType: 'image'
      };
    }

    if (typeof fileOrDataUrl === 'string') {
      return {
        url: fileOrDataUrl,
        rawUrl: fileOrDataUrl,
        publicId: `str_${Date.now()}`,
        resourceType: 'image'
      };
    }

    throw uploadErr || new Error('Upload failed');
  } catch (err) {
    console.error('Unified Upload Error:', err);
    // Final safety fallback: If it's a file, convert to base64 so admin operation succeeds
    if (fileOrDataUrl instanceof File) {
      try {
        const base64 = await fileToBase64(fileOrDataUrl);
        return {
          url: base64,
          rawUrl: base64,
          publicId: `fallback_${Date.now()}`,
          resourceType: 'image'
        };
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

// Export alias as uploadToStorage
export const uploadToStorage = uploadToCloudinary;
export default uploadToCloudinary;
