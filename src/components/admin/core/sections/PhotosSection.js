// core/sections/PhotosSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function PhotosSection({ components: C }) {
  const { 
    photoUploads, selectedPhotos, 
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    approvePhoto, deletePhoto
  } = useAdmin();
  
  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Gäste-Fotos ({photoUploads.length})</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.PhotoActions>
          <C.SmallButton onClick={selectAllPhotos}>Alle</C.SmallButton>
          <C.SmallButton onClick={deselectAllPhotos}>Keine</C.SmallButton>
          <C.PhotoCount>{selectedPhotos.size} ausgewählt</C.PhotoCount>
        </C.PhotoActions>
        
        <C.PhotoGrid>
          {photoUploads.map(photo => (
            <C.PhotoCard 
              key={photo.id} 
              $selected={selectedPhotos.has(photo.id)}
              $approved={photo.approved}
            >
              <C.PhotoImage $url={photo.cloudinary_url} onClick={() => togglePhotoSelection(photo.id)} />
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
            </C.PhotoCard>
          ))}
        </C.PhotoGrid>
        
        {!photoUploads.length && <C.EmptyState>Keine Fotos hochgeladen</C.EmptyState>}
      </C.PanelContent>
    </C.Panel>
  );
}

export default PhotosSection;
