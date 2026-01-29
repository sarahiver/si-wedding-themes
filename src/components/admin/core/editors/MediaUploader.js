// core/editors/MediaUploader.js - Supports Image AND Video Upload
import React, { useState, useRef } from 'react';
import { useAdmin } from '../AdminContext';

function MediaUploader({ 
  components: C, 
  media,
  onUpload,
  folder,
  ratio = '16/9',
  label = 'Hintergrund',
  allowVideo = false
}) {
  const { cloudName, uploadPreset, cloudinaryConfigured } = useAdmin();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaType, setMediaType] = useState(media?.type || 'image');
  const inputRef = useRef(null);

  const mediaUrl = typeof media === 'string' ? media : media?.url;
  const currentType = typeof media === 'string' ? 'image' : (media?.type || 'image');

  const upload = async (file) => {
    if (!cloudinaryConfigured) return;
    
    setUploading(true);
    setProgress(0);
    
    const isVideo = file.type.startsWith('video/');
    const uploadType = isVideo ? 'video' : 'image';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) formData.append('folder', folder);
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onUpload({ type: uploadType, url: data.secure_url });
      }
      setUploading(false);
      setProgress(0);
    };
    
    xhr.onerror = () => {
      console.error('Upload failed');
      setUploading(false);
      setProgress(0);
    };
    
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + cloudName + '/' + uploadType + '/upload');
    xhr.send(formData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (isImage || (allowVideo && isVideo)) {
        upload(file);
      }
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const acceptTypes = allowVideo ? 'image/*,video/*' : 'image/*';

  return (
    <C.FormGroup>
      <C.Label>{label}</C.Label>
      
      {allowVideo && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <C.SmallButton 
            $active={mediaType === 'image'}
            onClick={() => setMediaType('image')}
            type="button"
          >
            Bild
          </C.SmallButton>
          <C.SmallButton 
            $active={mediaType === 'video'}
            onClick={() => setMediaType('video')}
            type="button"
          >
            Video
          </C.SmallButton>
        </div>
      )}
      
      <C.DropZone
        $dragging={dragging}
        $hasImage={!!mediaUrl}
        $image={currentType === 'image' ? mediaUrl : null}
        $ratio={ratio}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        {mediaUrl ? (
          <>
            {currentType === 'video' && (
              <video 
                src={mediaUrl} 
                muted 
                loop 
                autoPlay 
                playsInline
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: 'grayscale(100%)'
                }} 
              />
            )}
            <C.DropOverlay className="overlay">
              <C.DropButton>{currentType === 'video' ? '🎬' : '📷'} Aendern</C.DropButton>
              <C.DropButton 
                $danger 
                onClick={(e) => { e.stopPropagation(); onUpload(null); }}
              >
                Entfernen
              </C.DropButton>
            </C.DropOverlay>
          </>
        ) : (
          <C.DropPlaceholder>
            <span>{allowVideo ? '🎬' : '📷'}</span>
            {cloudinaryConfigured 
              ? (allowVideo ? 'Bild oder Video hochladen' : 'Bild hochladen')
              : 'Cloudinary nicht konfiguriert'}
          </C.DropPlaceholder>
        )}
        {uploading && <C.ProgressBar $progress={progress} />}
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </C.DropZone>
      
      {allowVideo && (
        <C.HelpText style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888' }}>
          Tipp: Stockvideos von Pexels, Coverr oder Pixabay funktionieren super!
        </C.HelpText>
      )}
    </C.FormGroup>
  );
}

export default MediaUploader;
