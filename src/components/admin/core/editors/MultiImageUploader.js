// core/editors/MultiImageUploader.js - Multiple Image Upload Logic
import React, { useState, useRef } from 'react';
import { useAdmin } from '../AdminContext';

function MultiImageUploader({ 
  components: C, 
  images = [], 
  onAdd, 
  onRemove,
  folder,
  max = 20,
  label = 'Bilder'
}) {
  const { cloudName, uploadPreset, cloudinaryConfigured } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!cloudinaryConfigured) return;
    
    setUploading(true);
    
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
      onAdd({ url: data.secure_url, publicId: data.public_id });
    } catch (e) {
      console.error('Upload failed:', e);
    }
    
    setUploading(false);
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, max - images.length);
    for (const file of files) {
      await upload(file);
    }
    e.target.value = '';
  };

  return (
    <C.FormGroup>
      <C.Label>{label} ({images.length}/{max})</C.Label>
      <C.ImageGrid>
        {images.map((img, index) => (
          <C.ImageItem key={img.url || index} $url={img.url}>
            <C.RemoveButton onClick={() => onRemove(index)}>×</C.RemoveButton>
          </C.ImageItem>
        ))}
        {images.length < max && (
          <C.AddButton onClick={() => inputRef.current?.click()}>
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
    </C.FormGroup>
  );
}

export default MultiImageUploader;
