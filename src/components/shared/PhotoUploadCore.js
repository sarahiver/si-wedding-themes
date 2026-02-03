// src/components/shared/PhotoUploadCore.js
import React, { useState, useRef, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload, getPhotoUploads } from '../../lib/supabase';

export function usePhotoUpload(options = {}) {
  const { maxFiles = 10, maxSizeMB = 10 } = options;
  
  // Always call useWedding - it will return null values if not in provider
  const weddingContext = useWedding();
  
  // Safe access with multiple fallbacks
  const projectId = weddingContext?.projectId || weddingContext?.project?.id || null;
  const slug = weddingContext?.slug || weddingContext?.project?.slug || null;
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const isDemo = !projectId || projectId === 'demo';

  const loadPhotos = useCallback(async () => {
    if (isDemo) {
      setUploadedPhotos([]);
      return;
    }
    if (!projectId) return;
    try {
      const { data } = await getPhotoUploads(projectId, true);
      setUploadedPhotos(data || []);
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  }, [projectId, isDemo]);

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Nur Bilder erlaubt`);
        continue;
      }
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

    setFileCount(validFiles.length);
    await uploadFiles(validFiles);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setProgress(0);
    
    try {
      if (isDemo) {
        // Simulate upload in demo mode
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setProgress(i);
        }
        setSuccess(true);
        setProgress(100);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return { success: true };
      }
      
      const folder = `wedding_photos/${slug || projectId}`;
      const results = await uploadMultipleToCloudinary(files, folder, (progressInfo) => {
        // progressInfo = { current, total, percent }
        if (typeof progressInfo === 'object' && progressInfo.percent !== undefined) {
          setProgress(progressInfo.percent);
        } else if (typeof progressInfo === 'number') {
          setProgress(progressInfo);
        }
      });
      
      for (const result of results) {
        if (result.url && !result.error) {
          await submitPhotoUpload(projectId, {
            cloudinaryUrl: result.url,
            cloudinaryPublicId: result.publicId,
            uploadedBy: 'Guest',
          });
        }
      }
      
      setSuccess(true);
      setProgress(100);
      await loadPhotos();
      if (fileInputRef.current) fileInputRef.current.value = '';
      return { success: true };
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload fehlgeschlagen. Bitte erneut versuchen.');
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

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
    uploading, progress, uploadedPhotos, error, success, fileInputRef, isDemo, fileCount,
    handleFileSelect, openFilePicker, handleDrop, handleDragOver, loadPhotos,
    resetState: () => { setError(null); setSuccess(false); setProgress(0); setFileCount(0); },
  };
}

export function HiddenFileInput({ fileInputRef, handleFileSelect, multiple = true, accept = "image/*" }) {
  return (
    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple={multiple} accept={accept} style={{ display: 'none' }} />
  );
}

export default usePhotoUpload;
