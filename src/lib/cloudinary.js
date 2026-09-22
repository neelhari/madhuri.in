// Cloudinary Upload & Automatic Compression Utility for Images & Videos

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zoizrivw',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '578956434117562',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'vWX6Xji7Wgys7-wvwvXH2uHyvdY'
};

/**
 * Generates SHA-1 hash for Cloudinary signed upload using Web Crypto API
 */
async function generateSha1(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Inserts Cloudinary auto-compression and next-gen format conversion into image URLs.
 * Converts heavy 5MB-10MB phone uploads into ~50KB-100KB lightning-fast WebP/AVIF images.
 * 
 * @param {string} rawUrl - The original secure_url from Cloudinary
 * @param {number} maxWidth - Max width (default 1000px)
 * @returns {string} Fully optimized and compressed image URL
 */
export function getOptimizedCloudinaryUrl(rawUrl, maxWidth = 1000) {
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;
  if (!rawUrl.includes('cloudinary.com')) return rawUrl;
  if (rawUrl.includes('/q_auto,f_auto')) return rawUrl; // already transformed

  // Insert transformation after "/upload/"
  return rawUrl.replace(
    '/upload/',
    `/upload/q_auto,f_auto,w_${maxWidth},c_limit/`
  );
}

/**
 * Uploads a File or Base64 data to Cloudinary with automatic optimization
 * Supports images (.jpg, .png, .webp) and videos (.mp4, etc.)
 * 
 * @param {File|Blob|string} fileOrDataUrl - The file to upload
 * @param {Object} options - { folder: 'madhurfresh/products', resourceType: 'auto' | 'image' | 'video', maxWidth: 1000 }
 * @returns {Promise<{ url: string, rawUrl: string, publicId: string, resourceType: string, format: string }>}
 */
export async function uploadToCloudinary(fileOrDataUrl, options = {}) {
  const cloudName = CLOUDINARY_CONFIG.cloudName;
  const apiKey = CLOUDINARY_CONFIG.apiKey;
  const apiSecret = CLOUDINARY_CONFIG.apiSecret;

  const folder = options.folder || 'madhurfresh';
  const resourceType = options.resourceType || 'auto';
  const maxWidth = options.maxWidth || 1000;
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Parameter string for signature: folder=...&timestamp=...<apiSecret>
  const signatureParams = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = await generateSha1(signatureParams);

  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  try {
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    const rawSecureUrl = result.secure_url || result.url;
    const isImage = result.resource_type === 'image';
    
    // Automatically apply Cloudinary's AI compression & WebP format optimization for images
    const optimizedUrl = isImage
      ? getOptimizedCloudinaryUrl(rawSecureUrl, maxWidth)
      : rawSecureUrl;

    return {
      url: optimizedUrl,
      rawUrl: rawSecureUrl,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height
    };
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    throw err;
  }
}
