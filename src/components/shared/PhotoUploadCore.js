// src/components/shared/PhotoUploadCore.js
// Core photo upload logic - used by all themes

import React, { useState, useRef, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload, getPhotoUploads } from '../../lib/supabase';

/**
 * usePhotoUpload - Hook for photo upload functionality
 * @param {Object} options
 * @param {number} options.maxFiles - Maximum files allowed (default 10)
 * @param {number} options.maxSizeMB - Maximum file size in MB (default 10)
 * @param {boolean} options.autoApprove - Auto-approve uploads (default false)
 */
export function usePhotoUpload(options = {}) {
  const { maxFiles = 10, maxSizeMB = 10, autoApprove = false } = options;
  const { projectId, slug } = useWedding();
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Load existing photos
  const loadPhotos = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await getPhotoUploads(projectId, true);
      setUploadedPhotos(data || []);
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  }, [projectId]);

  // Validate files before upload
  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];
    
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Nur Bilder erlaubt`);
        continue;
      }
      
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name}: Datei zu groß (max ${maxSizeMB}MB)`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > maxFiles) {
      errors.push(`Maximal ${maxFiles} Dateien erlaubt`);
      return { validFiles: validFiles.slice(0, maxFiles), errors };
    }
    
    return { validFiles, errors };
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setError(null);
    setSuccess(false);
    
    const { validFiles, errors } = validateFiles(Array.from(files));
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      if (validFiles.length === 0) return;
    }
    
    await uploadFiles(validFiles);
  };

  // Upload files to Cloudinary and save to Supabase
  const uploadFiles = async (files) => {
    if (!projectId) {
      setError('Projekt nicht gefunden');
      return { success: false };
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      const folder = `wedding_photos/${slug || projectId}`;
      
      // Upload to Cloudinary
      const results = await uploadMultipleToCloudinary(files, {
        folder,
        onTotalProgress: setProgress,
      });
      
      // Save to Supabase
      const savedPhotos = [];
      for (const result of results) {
        if (result.url && !result.error) {
          const { data, error: dbError } = await submitPhotoUpload(projectId, {
            cloudinaryUrl: result.url,
            cloudinaryPublicId: result.publicId,
            uploadedBy: 'Guest', // Could be from a name input
          });
          
          if (!dbError && data) {
            savedPhotos.push(data);
          }
        }
      }
      
      setSuccess(true);
      setProgress(100);
      
      // Reload photos
      await loadPhotos();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      return { success: true, photos: savedPhotos };
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload fehlgeschlagen. Bitte erneut versuchen.');
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag and drop
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    
    const { validFiles, errors } = validateFiles(Array.from(files));
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      if (validFiles.length === 0) return;
    }
    
    await uploadFiles(validFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    // State
    uploading,
    progress,
    uploadedPhotos,
    error,
    success,
    
    // Refs
    fileInputRef,
    
    // Actions
    handleFileSelect,
    openFilePicker,
    handleDrop,
    handleDragOver,
    loadPhotos,
    
    // Reset
    resetState: () => {
      setError(null);
      setSuccess(false);
      setProgress(0);
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// REUSABLE FILE INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function HiddenFileInput({ fileInputRef, handleFileSelect, multiple = true, accept = "image/*" }) {
  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileSelect}
      multiple={multiple}
      accept={accept}
      style={{ display: 'none' }}
    />
  );
}

export default usePhotoUpload;
