// core/sections/PhotosSection.js - Photo Management with ZIP Download and Click Selection
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

function PhotosSection({ components: C }) {
  const { 
    photoUploads, selectedPhotos, 
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    approvePhoto, deletePhoto, showFeedback
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
      // Dynamically import JSZip
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      const folder = zip.folder('hochzeitsfotos');
      
      // Download each photo and add to ZIP
      const downloadPromises = photosToDownload.map(async (photo, index) => {
        try {
          const response = await fetch(photo.cloudinary_url);
          if (!response.ok) throw new Error('Download failed');
          const blob = await response.blob();
          
          // Get file extension from URL or default to jpg
          const urlParts = photo.cloudinary_url.split('.');
          const ext = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
          
          // Create filename: guest_name_index.ext
          const guestName = (photo.uploaded_by || photo.guest_name || 'gast').toLowerCase().replace(/\s+/g, '_');
          const filename = `${guestName}_${String(index + 1).padStart(3, '0')}.${ext}`;
          
          folder.file(filename, blob);
        } catch (err) {
          console.warn(`Failed to download photo ${photo.id}:`, err);
        }
      });
      
      await Promise.all(downloadPromises);
      
      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      // Create download link
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
      showFeedback('error', 'JSZip nicht verfügbar - bitte "npm install jszip" ausführen');
    } finally {
      setDownloading(false);
    }
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
        
        {/* Download Buttons */}
        <C.PhotoActions style={{ marginTop: '1rem' }}>
          <C.Button 
            onClick={() => downloadPhotosAsZip(false)} 
            disabled={downloading || selectedPhotos.size === 0}
            style={{ background: selectedPhotos.size > 0 ? '#2e7d32' : undefined }}
          >
            {downloading ? '⏳ Erstelle ZIP...' : `📦 Ausgewählte (${selectedPhotos.size}) als ZIP`}
          </C.Button>
          <C.Button 
            onClick={() => downloadPhotosAsZip(true)} 
            disabled={downloading || photoUploads.length === 0}
            style={{ marginLeft: '0.5rem' }}
          >
            {downloading ? '⏳ Erstelle ZIP...' : `📦 Alle (${photoUploads.length}) als ZIP`}
          </C.Button>
        </C.PhotoActions>
        
        {/* Photo Grid */}
        <C.PhotoGrid>
          {photoUploads.map(photo => {
            const isSelected = selectedPhotos.has(photo.id);
            return (
              <C.PhotoCard 
                key={photo.id} 
                $selected={isSelected}
                $approved={photo.approved}
                onClick={() => togglePhotoSelection(photo.id)}
                style={{ 
                  cursor: 'pointer',
                  outline: isSelected ? '3px solid #4caf50' : 'none',
                  outlineOffset: '-3px',
                  transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <C.PhotoImage $url={photo.cloudinary_url} />
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#4caf50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }}>
                    ✓
                  </div>
                )}
                
                {/* Action Buttons - stop propagation to not trigger selection */}
                <C.PhotoOverlay onClick={(e) => e.stopPropagation()}>
                  <C.PhotoButton 
                    $approve 
                    onClick={(e) => {
                      e.stopPropagation();
                      approvePhoto(photo.id, !photo.approved);
                    }}
                    title={photo.approved ? 'Ausblenden' : 'Freigeben'}
                  >
                    {photo.approved ? '👁️' : '✓'}
                  </C.PhotoButton>
                  <C.PhotoButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto(photo.id);
                    }}
                    title="Löschen"
                  >
                    ×
                  </C.PhotoButton>
                </C.PhotoOverlay>
                
                {!photo.approved && <C.PhotoPending>Ausstehend</C.PhotoPending>}
                {(photo.uploaded_by || photo.guest_name) && (
                  <C.PhotoCaption>{photo.uploaded_by || photo.guest_name}</C.PhotoCaption>
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
