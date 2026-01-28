// core/sections/PhotosSection.js - Photo Management with ZIP Download
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
      const JSZip = (await import('jszip')).default;
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
          const guestName = (photo.guest_name || 'gast').toLowerCase().replace(/\s+/g, '_');
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
      showFeedback('error', 'Fehler beim Erstellen des ZIPs');
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
        <C.PhotoActions>
          <C.SmallButton onClick={selectAllPhotos}>Alle auswählen</C.SmallButton>
          <C.SmallButton onClick={deselectAllPhotos}>Auswahl aufheben</C.SmallButton>
          <C.PhotoCount>{selectedPhotos.size} ausgewählt</C.PhotoCount>
        </C.PhotoActions>
        
        <C.PhotoActions style={{ marginTop: '1rem' }}>
          <C.Button 
            onClick={() => downloadPhotosAsZip(false)} 
            disabled={downloading || selectedPhotos.size === 0}
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
        
        <C.PhotoGrid>
          {photoUploads.map(photo => (
            <C.PhotoCard 
              key={photo.id} 
              $selected={selectedPhotos.has(photo.id)}
              $approved={photo.approved}
            >
              <C.PhotoImage 
                $url={photo.cloudinary_url} 
                onClick={() => togglePhotoSelection(photo.id)} 
              />
              <C.PhotoOverlay>
                <C.PhotoButton 
                  $approve 
                  onClick={() => approvePhoto(photo.id, !photo.approved)}
                  title={photo.approved ? 'Ausblenden' : 'Freigeben'}
                >
                  {photo.approved ? '👁️' : '✓'}
                </C.PhotoButton>
                <C.PhotoButton 
                  onClick={() => deletePhoto(photo.id)}
                  title="Löschen"
                >
                  ×
                </C.PhotoButton>
              </C.PhotoOverlay>
              {!photo.approved && <C.PhotoPending>Ausstehend</C.PhotoPending>}
              {photo.guest_name && <C.PhotoCaption>{photo.guest_name}</C.PhotoCaption>}
            </C.PhotoCard>
          ))}
        </C.PhotoGrid>
        
        {!photoUploads.length && <C.EmptyState>Noch keine Fotos hochgeladen</C.EmptyState>}
      </C.PanelContent>
    </C.Panel>
  );
}

export default PhotosSection;
