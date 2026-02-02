// core/editors/ArchiveEditor.js - Editor für Archiv-Seite mit Galerie-Upload und Foto-Download
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';
import MultiImageUploader from './MultiImageUploader';

function ArchiveEditor({ components: C }) {
  const { 
    contentStates, updateContent, saveContent, isSaving, baseFolder,
    photoUploads, selectedPhotos, 
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    showFeedback
  } = useAdmin();
  
  const content = contentStates.archive || {};
  const update = (field, value) => updateContent('archive', { ...content, [field]: value });
  
  const [downloading, setDownloading] = useState(false);
  
  // Archiv-Galerie Bilder (eigene, nicht die normale Galerie)
  const galleryImages = (content.gallery_images || []).map(img => typeof img === 'string' ? img : img.url);
  
  const handleGalleryImagesChange = (urls) => {
    update('gallery_images', urls.map(url => ({ url: typeof url === 'string' ? url : url.url })));
  };
  
  // Download Gäste-Fotos als ZIP
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
      const folder = zip.folder('gaeste-fotos');
      
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
      a.download = `gaeste-fotos_${new Date().toISOString().slice(0, 10)}.zip`;
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
        <C.PanelTitle>Archiv-Seite bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.AlertBox $type="info">
          Diese Seite wird angezeigt, wenn der Status auf "Archiv" steht (nach der Hochzeit).
        </C.AlertBox>
        
        {/* Hero-Bild */}
        <ImageUploader
          components={C}
          image={content.hero_image}
          onUpload={(url) => update('hero_image', url)}
          folder={`${baseFolder}/archive`}
          label="Hero-Bild"
          ratio="16/9"
          maxHeight="150px"
        />
        
        {/* Danke-Texte */}
        <C.FormGroup>
          <C.Label>Danke-Titel</C.Label>
          <C.Input 
            value={content.thank_you_title || ''} 
            onChange={(e) => update('thank_you_title', e.target.value)}
            placeholder="Danke!"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Danke-Text</C.Label>
          <C.TextArea 
            value={content.thank_you_text || ''} 
            onChange={(e) => update('thank_you_text', e.target.value)}
            placeholder="Vielen Dank, dass ihr diesen besonderen Tag mit uns gefeiert habt..."
            style={{ minHeight: '100px' }}
          />
        </C.FormGroup>
        
        <C.Divider />
        
        {/* Archiv-Galerie Upload */}
        <C.SectionLabel>📸 Eure Hochzeitsfotos</C.SectionLabel>
        <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
          Ladet hier eure professionellen Hochzeitsfotos hoch (max. 30 Bilder)
        </p>
        
        <MultiImageUploader
          components={C}
          images={galleryImages}
          onImagesChange={handleGalleryImagesChange}
          folder={`${baseFolder}/archive-gallery`}
          maxImages={30}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('archive')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
        
        <C.Divider />
        
        {/* Gäste-Fotos Download */}
        <C.SectionLabel>📥 Gäste-Fotos herunterladen</C.SectionLabel>
        <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
          Fotos, die eure Gäste hochgeladen haben ({photoUploads.length} Fotos)
        </p>
        
        {photoUploads.length > 0 ? (
          <>
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
              >
                {downloading ? '⏳ Erstelle ZIP...' : `📦 Ausgewählte (${selectedPhotos.size}) herunterladen`}
              </C.Button>
              <C.Button 
                onClick={() => downloadPhotosAsZip(true)} 
                disabled={downloading}
                $variant="secondary"
              >
                📦 Alle ({photoUploads.length}) herunterladen
              </C.Button>
            </C.PhotoActions>
            
            {/* Photo Grid Preview */}
            <C.PhotoGrid style={{ marginTop: '1.5rem' }}>
              {photoUploads.slice(0, 12).map(photo => {
                const isSelected = selectedPhotos.has(photo.id);
                return (
                  <C.PhotoCard 
                    key={photo.id} 
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
                    
                    {/* Selection Checkbox */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: isSelected ? '#4caf50' : 'rgba(0,0,0,0.5)',
                        border: isSelected ? '2px solid #4caf50' : '2px solid rgba(255,255,255,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        zIndex: 15,
                        pointerEvents: 'none'
                      }}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    
                    {photo.uploaded_by && (
                      <C.PhotoCaption>{photo.uploaded_by}</C.PhotoCaption>
                    )}
                  </C.PhotoCard>
                );
              })}
            </C.PhotoGrid>
            
            {photoUploads.length > 12 && (
              <p style={{ marginTop: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                ... und {photoUploads.length - 12} weitere Fotos
              </p>
            )}
          </>
        ) : (
          <C.EmptyState>Noch keine Gäste-Fotos vorhanden</C.EmptyState>
        )}
      </C.PanelContent>
    </C.Panel>
  );
}

export default ArchiveEditor;
