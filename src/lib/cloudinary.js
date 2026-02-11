// src/lib/cloudinary.js
// Direct Cloudinary upload without widget

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Upload a single file to Cloudinary
 */
export async function uploadToCloudinary(file, folder = '', onProgress = null) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary nicht konfiguriert');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }
  console.log('[Cloudinary] Upload →', { folder: folder || '(none)', preset: UPLOAD_PRESET });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        console.log('[Cloudinary] Upload OK →', { public_id: response.public_id, folder: response.folder, url: response.secure_url });
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
        });
      } else {
        reject(new Error('Upload fehlgeschlagen'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Netzwerkfehler')));
    xhr.addEventListener('abort', () => reject(new Error('Upload abgebrochen')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultiple(files, folder = '', onProgress = null) {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadToCloudinary(files[i], folder, (percent) => {
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percent: Math.round(((i + percent / 100) / files.length) * 100),
        });
      }
    });
    results.push(result);
  }
  
  return results;
}

// Alias for backwards compatibility
export const uploadMultipleToCloudinary = uploadMultiple;

/**
 * Generate optimized Cloudinary URL
 */
export function getOptimizedUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary')) return url;
  
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transforms = `f_${format},q_${quality}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (width || height) transforms += ',c_fill';
  
  return url.replace('/upload/', `/upload/${transforms}/`);
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured() {
  return !!(CLOUD_NAME && UPLOAD_PRESET);
}

export default {
  uploadToCloudinary,
  uploadMultiple,
  uploadMultipleToCloudinary: uploadMultiple,
  getOptimizedUrl,
  isCloudinaryConfigured,
};
