// core/editors/MultiImageUploader.js - Drag&Drop Multi-Upload mit Sortierung & Captions
import React, { useState, useRef, useCallback } from 'react';
import { useAdmin } from '../AdminContext';

function MultiImageUploader({ 
  components: C, 
  images = [],        // Array of { url, caption? } or strings
  onImagesChange,     // Receives full array of { url, caption }
  folder,
  max = 20,
  maxImages,
  label = 'Bilder',
  showCaptions = false,
}) {
  const { cloudName, uploadPreset, cloudinaryConfigured } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  
  const maxCount = maxImages || max;

  // Normalize images to { url, caption } format
  const normalizedImages = images.map(img => 
    typeof img === 'string' ? { url: img, caption: '' } : { url: img.url || '', caption: img.caption || '' }
  );

  // Upload single file
  const uploadFile = async (file, index, total) => {
    if (!cloudinaryConfigured) return null;
    
    setUploadProgress({ current: index + 1, total, fileName: file.name });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder);
      formData.append('asset_folder', folder);
    }
    
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        return { url: data.secure_url, caption: '' };
      }
      return null;
    } catch (e) {
      console.error('Upload failed:', e);
      return null;
    }
  };

  // Process files (from input or drop)
  const processFiles = useCallback(async (files) => {
    const imageFiles = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, maxCount - normalizedImages.length);
    
    if (imageFiles.length === 0) return;
    
    setUploading(true);
    
    const newImages = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const result = await uploadFile(imageFiles[i], i, imageFiles.length);
      if (result) newImages.push(result);
    }
    
    if (onImagesChange && newImages.length > 0) {
      onImagesChange([...normalizedImages, ...newImages]);
    }
    
    setUploading(false);
    setUploadProgress({ current: 0, total: 0, fileName: '' });
  }, [normalizedImages, maxCount, onImagesChange, cloudinaryConfigured]); // eslint-disable-line

  // File input change
  const handleFileChange = async (e) => {
    await processFiles(e.target.files);
    e.target.value = '';
  };

  // Drag & Drop - Zone (file from desktop)
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer?.types?.includes('Files')) {
      setDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragging(false);
    dragCounter.current = 0;
    
    if (dragIndex !== null) return; // Internal reorder, handled by item drop
    
    const files = e.dataTransfer?.files;
    if (files?.length > 0) {
      await processFiles(files);
    }
  }, [dragIndex, processFiles]);

  // Reorder - drag items within grid
  const handleItemDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleItemDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex !== null && index !== dragIndex) {
      setDragOverIndex(index);
    }
  };

  const handleItemDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const reordered = [...normalizedImages];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    
    onImagesChange(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Remove image
  const handleRemove = (index) => {
    onImagesChange(normalizedImages.filter((_, i) => i !== index));
  };

  // Update caption
  const handleCaptionChange = (index, caption) => {
    const updated = [...normalizedImages];
    updated[index] = { ...updated[index], caption };
    onImagesChange(updated);
  };

  const isEmpty = normalizedImages.length === 0 && !uploading;

  return (
    <div>
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '0.75rem'
      }}>
        <C.Label style={{ margin: 0 }}>{label} ({normalizedImages.length}/{maxCount})</C.Label>
        {normalizedImages.length > 1 && (
          <span style={{ 
            fontSize: '0.65rem', 
            color: 'rgba(255,255,255,0.35)', 
            letterSpacing: '0.05em' 
          }}>
            Bilder ziehen zum Sortieren
          </span>
        )}
      </div>

      {/* Upload Progress */}
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
            width: '24px', height: '24px', flexShrink: 0,
            border: '3px solid rgba(196, 30, 58, 0.3)',
            borderTopColor: '#C41E3A', borderRadius: '50%',
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
              height: '4px', background: 'rgba(255,255,255,0.1)',
              marginTop: '0.5rem', borderRadius: '2px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', background: '#C41E3A',
                width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          border: dragging 
            ? '2px dashed #C41E3A' 
            : isEmpty ? '2px dashed rgba(255,255,255,0.15)' : '2px dashed transparent',
          borderRadius: '8px',
          padding: isEmpty ? '0' : '0.5rem',
          background: dragging ? 'rgba(196, 30, 58, 0.08)' : 'transparent',
          transition: 'all 0.2s ease',
          minHeight: isEmpty ? '160px' : 'auto',
        }}
      >
        {/* Drag overlay when images exist */}
        {dragging && !isEmpty && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(196, 30, 58, 0.15)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ 
              color: '#C41E3A', fontWeight: '600', fontSize: '0.9rem',
              background: 'rgba(0,0,0,0.7)', padding: '0.75rem 1.5rem',
              borderRadius: '6px'
            }}>
              Bilder hier ablegen
            </span>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div 
            onClick={() => inputRef.current?.click()}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '160px', cursor: 'pointer',
              color: dragging ? '#C41E3A' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</span>
            <span style={{ fontSize: '0.85rem' }}>
              {cloudinaryConfigured 
                ? 'Bilder hochladen oder hierher ziehen' 
                : '⚠️ Cloudinary nicht konfiguriert'}
            </span>
          </div>
        )}

        {/* Image Grid */}
        {normalizedImages.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: showCaptions 
              ? 'repeat(auto-fill, minmax(160px, 1fr))' 
              : 'repeat(auto-fill, 80px)',
            gap: showCaptions ? '1rem' : '0.5rem',
          }}>
            {normalizedImages.map((img, index) => (
              <div
                key={img.url + '-' + index}
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleItemDrop(e, index)}
                onDragEnd={handleItemDragEnd}
                style={{
                  position: 'relative',
                  opacity: dragIndex === index ? 0.4 : 1,
                  transform: dragOverIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                  outline: dragOverIndex === index ? '2px solid #C41E3A' : 'none',
                  outlineOffset: '2px',
                  borderRadius: '4px',
                  cursor: 'grab',
                }}
              >
                {/* Image thumbnail */}
                <div 
                  className="multi-img-thumb"
                  style={{
                    aspectRatio: showCaptions ? '4/3' : '1',
                    backgroundImage: `url(${img.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '4px',
                    filter: 'grayscale(30%)',
                    transition: 'filter 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* Remove button */}
                  <button
                    className="multi-img-remove"
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      width: '22px', height: '22px',
                      background: 'rgba(196, 30, 58, 0.9)',
                      border: 'none', borderRadius: '50%',
                      color: '#fff', fontSize: '14px', lineHeight: '1',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.15s',
                    }}
                  >
                    ×
                  </button>

                  {/* Index badge */}
                  <span style={{
                    position: 'absolute', bottom: '4px', left: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.55rem', fontWeight: '600',
                    padding: '2px 5px', borderRadius: '3px',
                    letterSpacing: '0.05em',
                  }}>
                    {index + 1}
                  </span>
                </div>

                {/* Caption input */}
                {showCaptions && (
                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder="Bildunterschrift..."
                    draggable={false}
                    style={{
                      width: '100%', marginTop: '0.4rem',
                      padding: '0.4rem 0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.75rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(196,30,58,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            ))}

            {/* Add button */}
            {normalizedImages.length < maxCount && !uploading && (
              <div
                onClick={() => inputRef.current?.click()}
                style={{
                  aspectRatio: showCaptions ? '4/3' : '1',
                  background: 'rgba(255,255,255,0.02)',
                  border: '2px dashed rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s ease',
                  minWidth: showCaptions ? 'auto' : '80px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C41E3A';
                  e.currentTarget.style.color = '#C41E3A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>+</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {!cloudinaryConfigured && normalizedImages.length > 0 && (
        <C.HelpText>⚠️ Cloudinary nicht konfiguriert - Upload deaktiviert</C.HelpText>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .multi-img-thumb:hover { filter: grayscale(0%) !important; }
        .multi-img-thumb:hover .multi-img-remove { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

export default MultiImageUploader;
