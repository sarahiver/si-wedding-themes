// core/editors/MultiImageUploader.js - Multiple Image Upload mit Status
import React, { useState, useRef } from 'react';
import { useAdmin } from '../AdminContext';

function MultiImageUploader({ 
  components: C, 
  images = [], 
  onImagesChange,  // New API: receives full array
  onAdd,           // Old API: receives single item
  onRemove,        // Old API: receives index
  folder,
  max = 20,
  maxImages,       // Alias for max
  label = 'Bilder'
}) {
  const { cloudName, uploadPreset, cloudinaryConfigured } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' });
  const inputRef = useRef(null);
  
  const maxCount = maxImages || max;

  const upload = async (file, index, total) => {
    if (!cloudinaryConfigured) {
      console.error('Cloudinary not configured');
      return null;
    }
    
    setUploadProgress({ current: index + 1, total, fileName: file.name });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) formData.append('folder', folder);
    
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      return { url: data.secure_url, publicId: data.public_id };
    } catch (e) {
      console.error('Upload failed:', e);
      return null;
    }
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, maxCount - images.length);
    if (files.length === 0) return;
    
    setUploading(true);
    
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const result = await upload(files[i], i, files.length);
      if (result) {
        newImages.push(result.url);
        // Support both APIs
        if (onAdd) {
          onAdd(result);
        }
      }
    }
    
    // New API: send full updated array
    if (onImagesChange && newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
    
    setUploading(false);
    setUploadProgress({ current: 0, total: 0, fileName: '' });
    e.target.value = '';
  };

  const handleRemove = (index) => {
    if (onRemove) {
      onRemove(index);
    }
    if (onImagesChange) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  return (
    <C.FormGroup>
      <C.Label>{label} ({images.length}/{maxCount})</C.Label>
      
      {/* Upload Status */}
      {uploading && (
        <div style={{
          background: 'rgba(196, 30, 58, 0.1)',
          border: '1px solid rgba(196, 30, 58, 0.3)',
          padding: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(196, 30, 58, 0.3)',
            borderTopColor: '#C41E3A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#C41E3A', fontWeight: '600', fontSize: '0.85rem' }}>
              Uploading... {uploadProgress.current}/{uploadProgress.total}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {uploadProgress.fileName}
            </div>
            <div style={{
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              marginTop: '0.5rem',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: '#C41E3A',
                width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      )}
      
      <C.ImageGrid>
        {images.map((img, index) => {
          const url = typeof img === 'string' ? img : img.url;
          return (
            <C.ImageItem key={url || index} $url={url}>
              <C.RemoveButton onClick={() => handleRemove(index)}>×</C.RemoveButton>
            </C.ImageItem>
          );
        })}
        {images.length < maxCount && !uploading && (
          <C.AddButton onClick={() => inputRef.current?.click()}>
            <span>+</span>
          </C.AddButton>
        )}
      </C.ImageGrid>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {!cloudinaryConfigured && (
        <C.HelpText>⚠️ Cloudinary nicht konfiguriert - Upload deaktiviert</C.HelpText>
      )}
      
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </C.FormGroup>
  );
}

export default MultiImageUploader;
