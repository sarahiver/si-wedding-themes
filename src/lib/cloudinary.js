// src/lib/cloudinary.js

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dqpgnarqr';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'wedding_uploads';

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder path
 * @param {function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{url: string, publicId: string, error: string|null}>}
 */
export async function uploadToCloudinary(file, options = {}) {
  const { folder = 'wedding_photos', onProgress } = options;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);
  
  try {
    const xhr = new XMLHttpRequest();
    
    const uploadPromise = new Promise((resolve, reject) => {
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
      
      // Progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        };
      }
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            error: null,
          });
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
    
    return await uploadPromise;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      url: null,
      publicId: null,
      error: error.message || 'Upload fehlgeschlagen',
    };
  }
}

/**
 * Upload multiple files to Cloudinary
 * @param {FileList|File[]} files - Files to upload
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder path
 * @param {function} options.onFileProgress - Per-file progress callback (fileIndex, progress)
 * @param {function} options.onTotalProgress - Total progress callback (0-100)
 * @returns {Promise<Array<{url: string, publicId: string, error: string|null}>>}
 */
export async function uploadMultipleToCloudinary(files, options = {}) {
  const { folder = 'wedding_photos', onFileProgress, onTotalProgress } = options;
  const results = [];
  const totalFiles = files.length;
  
  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    
    const result = await uploadToCloudinary(file, {
      folder,
      onProgress: (progress) => {
        if (onFileProgress) onFileProgress(i, progress);
        if (onTotalProgress) {
          const totalProgress = Math.round(((i * 100) + progress) / totalFiles);
          onTotalProgress(totalProgress);
        }
      },
    });
    
    results.push(result);
  }
  
  return results;
}

/**
 * Generate optimized Cloudinary URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} Optimized URL
 */
export function getOptimizedUrl(publicId, transformations = {}) {
  const {
    width = 800,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = transformations;
  
  let transform = `q_${quality},f_${format}`;
  
  if (width) transform += `,w_${width}`;
  if (height) transform += `,h_${height}`;
  if (crop) transform += `,c_${crop}`;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

/**
 * Generate thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @param {number} size - Thumbnail size (default 200)
 * @returns {string} Thumbnail URL
 */
export function getThumbnailUrl(publicId, size = 200) {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto',
    format: 'auto',
  });
}

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  getOptimizedUrl,
  getThumbnailUrl,
};
