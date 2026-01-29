// core/sections/PhotosSection.js - Photo Management with ZIP Download
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

function PhotosSection({ components: C }) {
  const { 
    photoUploads, selectedPhotos, 
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    deletePhoto, showFeedback
  } = useAdmin();
  
  const [downloading, setDownloading] = useState(false);
  
  // Download selected or all photos as ZIP
  const downloadPhotosAsZip = async (downloadAll = false) => {
    const photosToDownload = downloadAll 
      ? photoUploads 
      : photoUploads.filter(p => selectedPhotos.has(p.id));
    
    if (photosToDownload.length === 0) {
      showFeedback('error', 'Keine Fotos ausgewählt');
      return;
    }
    
    setDownloading(true);
    showFeedback('success', `Lade ${photosToDownload.length} Fotos...`);
    
    try {
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      const folder = zip.folder('hochzeitsfotos');
      
      const downloadPromises = photosToDownload.map(async (photo, index) => {
        try {
          const response = await fetch(photo.cloudinary_url);
          if (!response.ok) throw new Error('Download failed');
          const blob = await response.blob();
          
          const urlParts = photo.cloudinary_url.split('.');
          const ext = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
          const guestName = (photo.uploaded_by || 'gast').toLowerCase().replace(/\s+/g, '_');
          const filename = `${guestName}_${String(index + 1).padStart(3, '0')}.${ext}`;
          
          folder.file(filename, blob);
        } catch (err) {
          console.warn(`Failed to download photo ${photo.id}:`, err);
        }
      });
      
      await Promise.all(downloadPromises);
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hochzeitsfotos_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showFeedback('success', `${photosToDownload.length} Fotos heruntergeladen!`);
    } catch (err) {
      console.error('ZIP creation failed:', err);
      showFeedback('error', 'Fehler beim Erstellen des ZIPs');
    } finally {
      setDownloading(false);
    }
  };

  // Bulk delete selected photos
  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) {
      showFeedback('error', 'Keine Fotos ausgewählt');
      return;
    }
    
    if (!window.confirm(`${selectedPhotos.size} Foto(s) wirklich löschen?`)) return;
    
    for (const id of selectedPhotos) {
      await deletePhoto(id, true); // true = skip confirm
    }
    deselectAllPhotos();
  };
  
  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Gäste-Fotos ({photoUploads.length})</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {/* Selection Controls */}
        <C.PhotoActions>
          <C.SmallButton onClick={selectAllPhotos}>Alle auswählen</C.SmallButton>
          <C.SmallButton onClick={deselectAllPhotos}>Auswahl aufheben</C.SmallButton>
          <C.PhotoCount>{selectedPhotos.size} ausgewählt</C.PhotoCount>
        </C.PhotoActions>
        
        {/* Action Buttons */}
        <C.PhotoActions style={{ marginTop: '1rem' }}>
          <C.Button 
            onClick={() => downloadPhotosAsZip(false)} 
            disabled={downloading || selectedPhotos.size === 0}
          >
            {downloading ? '⏳ Erstelle ZIP...' : `📦 Ausgewählte (${selectedPhotos.size}) herunterladen`}
          </C.Button>
          <C.Button 
            onClick={() => downloadPhotosAsZip(true)} 
            disabled={downloading || photoUploads.length === 0}
            $variant="secondary"
          >
            📦 Alle herunterladen
          </C.Button>
          {selectedPhotos.size > 0 && (
            <C.Button 
              onClick={deleteSelectedPhotos}
              $variant="danger"
            >
              🗑 Ausgewählte löschen
            </C.Button>
          )}
        </C.PhotoActions>
        
        {/* Photo Grid */}
        <C.PhotoGrid style={{ marginTop: '1.5rem' }}>
          {photoUploads.map(photo => {
            const isSelected = selectedPhotos.has(photo.id);
            return (
              <C.PhotoCard 
                key={photo.id} 
                $selected={isSelected}
                onClick={() => togglePhotoSelection(photo.id)}
                style={{ 
                  cursor: 'pointer',
                  outline: isSelected ? '3px solid #4caf50' : '3px solid transparent',
                  outlineOffset: '-3px',
                  transform: isSelected ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <C.PhotoImage $url={photo.cloudinary_url} />
                
                {/* Selection Checkbox - oben links */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: isSelected ? '#4caf50' : 'rgba(0,0,0,0.5)',
                    border: isSelected ? '2px solid #4caf50' : '2px solid rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    zIndex: 15,
                    pointerEvents: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected ? '✓' : ''}
                </div>
                
                {/* Delete Button - Mitte */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(196, 30, 58, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                    zIndex: 15,
                    cursor: 'pointer',
                    opacity: 0.8,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  }}
                  title="Löschen"
                >
                  ×
                </div>
                
                {/* Uploader Name */}
                {photo.uploaded_by && (
                  <C.PhotoCaption>{photo.uploaded_by}</C.PhotoCaption>
                )}
              </C.PhotoCard>
            );
          })}
        </C.PhotoGrid>
        
        {!photoUploads.length && <C.EmptyState>Noch keine Fotos hochgeladen</C.EmptyState>}
      </C.PanelContent>
    </C.Panel>
  );
}

export default PhotosSection;
