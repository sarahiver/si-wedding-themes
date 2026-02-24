// core/sections/PhotosSection.js - Photo Management with ZIP Download & Auto-Delete
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { deletePhotoUpload, authFetch } from '../../../../lib/supabase';

function PhotosSection({ components: C }) {
  const {
    photoUploads, selectedPhotos,
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    deletePhoto, showFeedback, loadData, projectId
  } = useAdmin();
  
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Download selected or all photos as ZIP, then auto-delete from Cloudinary + Supabase
  const downloadAndDelete = async (downloadAll = false) => {
    const photosToDownload = downloadAll 
      ? photoUploads 
      : photoUploads.filter(p => selectedPhotos.has(p.id));
    
    if (photosToDownload.length === 0) {
      showFeedback('error', 'Keine Fotos ausgewählt');
      return;
    }
    
    setDownloading(true);
    showFeedback('success', `Lade ${photosToDownload.length} Fotos herunter...`);
    
    try {
      // Step 1: Download as ZIP
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      const folder = zip.folder('hochzeitsfotos');
      
      let successCount = 0;
      
      const downloadPromises = photosToDownload.map(async (photo, index) => {
        try {
          const response = await fetch(photo.cloudinary_url);
          if (!response.ok) throw new Error('Download failed');
          const blob = await response.blob();
          
          const urlParts = photo.cloudinary_url.split('.');
          const ext = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
          const name = photo.uploaded_by 
            ? `${photo.uploaded_by.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_')}_${index + 1}.${ext}`
            : `foto_${index + 1}.${ext}`;
          
          folder.file(name, blob);
          successCount++;
        } catch (err) {
          console.error(`Failed to download photo ${index}:`, err);
        }
      });
      
      await Promise.all(downloadPromises);
      
      if (successCount === 0) {
        showFeedback('error', 'Keine Fotos konnten heruntergeladen werden');
        setDownloading(false);
        return;
      }
      
      // Generate & trigger download
      const today = new Date().toISOString().split('T')[0];
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hochzeitsfotos_${today}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setDownloading(false);
      
      // Step 2: Auto-delete from Cloudinary + Supabase
      setDeleting(true);
      showFeedback('success', `Download fertig! Lösche ${successCount} Fotos aus Datenschutzgründen...`);

      let deleteErrors = 0;

      // Collect public_ids for Cloudinary batch delete
      const publicIds = photosToDownload
        .filter(p => p.cloudinary_public_id)
        .map(p => p.cloudinary_public_id);

      // Delete from Cloudinary via API route
      if (publicIds.length > 0) {
        try {
          const deleteResponse = await authFetch('/api/delete-photos', {
            method: 'POST',
            body: JSON.stringify({ public_ids: publicIds, projectId }),
          });

          if (!deleteResponse.ok) {
            const errData = await deleteResponse.json().catch(() => ({}));
            console.error('Cloudinary delete failed:', errData);
            deleteErrors++;
          }
        } catch (err) {
          console.error('Cloudinary delete error:', err);
          deleteErrors++;
        }
      } else {
        console.warn('Keine cloudinary_public_id vorhanden — Cloudinary-Löschung übersprungen');
      }

      // Delete from Supabase (direkt, ohne deletePhoto aus Context)
      for (const photo of photosToDownload) {
        try {
          const { error } = await deletePhotoUpload(photo.id);
          if (error) {
            console.error('Supabase delete error for', photo.id, ':', error);
            deleteErrors++;
          }
        } catch (err) {
          console.error('Supabase delete error:', err);
          deleteErrors++;
        }
      }

      await loadData();
      deselectAllPhotos();
      setDeleting(false);

      if (deleteErrors > 0) {
        showFeedback('error', `Download fertig, aber ${deleteErrors} Fehler beim Löschen. Prüfe die Browser-Konsole.`);
      } else {
        showFeedback('success', `${successCount} Fotos heruntergeladen und gelöscht ✓`);
      }
      
    } catch (err) {
      console.error('Download/delete error:', err);
      showFeedback('error', 'Fehler beim Herunterladen');
      setDownloading(false);
      setDeleting(false);
    }
  };
  
  // Delete selected photos (without download)
  const deleteSelected = async () => {
    const photosToDelete = photoUploads.filter(p => selectedPhotos.has(p.id));
    
    if (photosToDelete.length === 0) {
      showFeedback('error', 'Keine Fotos ausgewählt');
      return;
    }
    
    if (!window.confirm(`${photosToDelete.length} Foto(s) unwiderruflich löschen?`)) return;
    
    setDeleting(true);
    
    // Cloudinary delete
    const publicIds = photosToDelete
      .filter(p => p.cloudinary_public_id)
      .map(p => p.cloudinary_public_id);
    
    if (publicIds.length > 0) {
      try {
        await authFetch('/api/delete-photos', {
          method: 'POST',
          body: JSON.stringify({ public_ids: publicIds, projectId }),
        });
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }
    
    // Supabase delete (DB only - Cloudinary already handled above)
    for (const photo of photosToDelete) {
      try {
        await deletePhotoUpload(photo.id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    
    await loadData();
    deselectAllPhotos();
    setDeleting(false);
    showFeedback('success', `${photosToDelete.length} Foto(s) gelöscht ✓`);
  };
  
  const selectedCount = selectedPhotos.size;
  const isWorking = downloading || deleting;

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>GÄSTE-FOTOS ({photoUploads.length})</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        
        {photoUploads.length > 0 && (
          <>
            {/* Selection Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <C.Button onClick={selectAllPhotos} disabled={isWorking}>
                Alle auswählen
              </C.Button>
              <C.Button onClick={deselectAllPhotos} disabled={isWorking}>
                Auswahl aufheben
              </C.Button>
            </div>
            
            {selectedCount > 0 && (
              <div style={{ marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
                {selectedCount} ausgewählt
              </div>
            )}
            
            {/* Download Button — with auto-delete info */}
            {selectedCount > 0 && (
              <C.Button 
                $primary 
                onClick={() => downloadAndDelete(false)}
                disabled={isWorking}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.75rem' }}
              >
                {downloading ? '⏳ Wird heruntergeladen...' : 
                 deleting ? '🗑️ Wird gelöscht...' :
                 `📥 ${selectedCount} FOTO(S) HERUNTERLADEN`}
              </C.Button>
            )}
            
            {/* Download All */}
            <C.Button 
              onClick={() => downloadAndDelete(true)}
              disabled={isWorking}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              {isWorking ? '⏳ Bitte warten...' : '📦 ALLE HERUNTERLADEN'}
            </C.Button>
            
            {/* Info text */}
            <div style={{ 
              fontSize: '0.75rem', 
              opacity: 0.5, 
              marginBottom: '1rem',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Fotos werden nach dem Download aus Datenschutzgründen automatisch gelöscht.
            </div>
            
            {/* Delete without download */}
            {selectedCount > 0 && (
              <C.Button 
                onClick={deleteSelected}
                disabled={isWorking}
                style={{ 
                  width: '100%', 
                  marginBottom: '1rem',
                  background: 'rgba(244, 67, 54, 0.15)',
                  color: '#f44336',
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}
              >
                🗑️ AUSGEWÄHLTE LÖSCHEN (ohne Download)
              </C.Button>
            )}
          </>
        )}
        
        {/* Photo Grid */}
        <C.PhotoGrid>
          {photoUploads.map((photo) => {
            const isSelected = selectedPhotos.has(photo.id);
            return (
              <C.PhotoCard
                key={photo.id}
                onClick={() => !isWorking && togglePhotoSelection(photo.id)}
                style={{
                  cursor: isWorking ? 'wait' : 'pointer',
                  opacity: isWorking ? 0.6 : 1,
                  outline: isSelected ? '3px solid #4caf50' : 'none',
                  outlineOffset: '-3px',
                  transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <C.PhotoImage $url={photo.cloudinary_url} />

                {/* Missing URL indicator */}
                {!photo.cloudinary_url && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(244,67,54,0.1)',
                    fontSize: '0.7rem', color: 'rgba(244,67,54,0.8)',
                    textAlign: 'center', padding: '0.5rem',
                  }}>
                    <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚠️</span>
                    Kein Bild-URL
                  </div>
                )}

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
                
                {/* Delete Button */}
                <C.PhotoOverlay onClick={(e) => e.stopPropagation()}>
                  <C.PhotoButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isWorking) deletePhoto(photo.id);
                    }}
                    title="Löschen"
                  >
                    ×
                  </C.PhotoButton>
                </C.PhotoOverlay>
                
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
