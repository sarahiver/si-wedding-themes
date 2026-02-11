// core/editors/ImageUploader.js - Reusable Image Upload Logic
import React, { useState, useRef } from 'react';
import { useAdmin } from '../AdminContext';

function ImageUploader({ 
  components: C, 
  image, 
  onUpload, 
  folder,
  ratio = '16/9',
  maxHeight = null,
  label = 'Bild'
}) {
  const { cloudName, uploadPreset, cloudinaryConfigured } = useAdmin();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!cloudinaryConfigured) return;
    
    setUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder);
      formData.append('asset_folder', folder);
    }
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onUpload(data.secure_url);
      }
      setUploading(false);
      setProgress(0);
    };
    
    xhr.onerror = () => {
      console.error('Upload failed');
      setUploading(false);
      setProgress(0);
    };
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      upload(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <C.FormGroup>
      <C.Label>{label}</C.Label>
      <C.DropZone
        $dragging={dragging}
        $hasImage={!!image}
        $image={image}
        $ratio={ratio}
        style={maxHeight ? { maxHeight, minHeight: maxHeight, aspectRatio: 'unset' } : {}}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <C.DropOverlay className="overlay">
            <C.DropButton>📷 Ändern</C.DropButton>
            <C.DropButton 
              $danger 
              onClick={(e) => { e.stopPropagation(); onUpload(null); }}
            >
              🗑 Entfernen
            </C.DropButton>
          </C.DropOverlay>
        ) : (
          <C.DropPlaceholder>
            <span>📷</span>
            {cloudinaryConfigured ? 'Bild hochladen oder hierher ziehen' : '⚠️ Cloudinary nicht konfiguriert'}
          </C.DropPlaceholder>
        )}
        {uploading && <C.ProgressBar $progress={progress} />}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </C.DropZone>
    </C.FormGroup>
  );
}

export default ImageUploader;
