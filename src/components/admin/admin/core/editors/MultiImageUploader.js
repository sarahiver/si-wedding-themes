// core/editors/MultiImageUploader.js - Multiple Image Upload Logic
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
  const inputRef = useRef(null);
  
  const maxCount = maxImages || max;

  const upload = async (file) => {
    if (!cloudinaryConfigured) {
      console.error('Cloudinary not configured');
      return null;
    }
    
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
    setUploading(true);
    
    const newImages = [];
    for (const file of files) {
      const result = await upload(file);
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
      <C.ImageGrid>
        {images.map((img, index) => {
          const url = typeof img === 'string' ? img : img.url;
          return (
            <C.ImageItem key={url || index} $url={url}>
              <C.RemoveButton onClick={() => handleRemove(index)}>×</C.RemoveButton>
            </C.ImageItem>
          );
        })}
        {images.length < maxCount && (
          <C.AddButton onClick={() => inputRef.current?.click()} disabled={uploading}>
            <span>{uploading ? '...' : '+'}</span>
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
    </C.FormGroup>
  );
}

export default MultiImageUploader;
