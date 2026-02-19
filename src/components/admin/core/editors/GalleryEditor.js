// core/editors/GalleryEditor.js - Mit Drag&Drop, Captions & Sortierung
import React from 'react';
import { useAdmin } from '../AdminContext';
import MultiImageUploader from './MultiImageUploader';

function GalleryEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder, project } = useAdmin();
  const showCaptions = ['botanical', 'editorial', 'video'].includes(project?.theme);
  const isParallax = project?.theme === 'parallax';
  const content = contentStates.gallery || {};
  const update = (field, value) => updateContentField('gallery', field, value);

  // Normalize images to { url, caption } format
  const images = (content.images || []).map(img => 
    typeof img === 'string' ? { url: img, caption: '' } : { url: img.url || '', caption: img.caption || '' }
  );

  const handleImagesChange = (newImages) => {
    // Store full objects with url + caption
    update('images', newImages.map(img => ({ 
      url: typeof img === 'string' ? img : img.url, 
      caption: img.caption || '' 
    })));
  };

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Galerie bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Galerie"
          />
        </C.FormGroup>

        
        <C.Divider />
        
        <C.SectionLabel>Bilder (max. 20)</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Bilder per Drag &amp; Drop hochladen. Reihenfolge durch Ziehen ändern.
        </C.HelpText>
        {isParallax && (
          <C.AlertBox $type={images.length >= 10 ? 'success' : 'warning'} style={{ marginBottom: '1rem' }}>
            {images.length >= 10
              ? `${images.length} Bilder hochgeladen — alle Website-Bereiche sind versorgt.`
              : `Parallax Theme: Mindestens 10 Bilder hochladen (aktuell: ${images.length}). Die Bilder werden automatisch auf alle Bereiche der Website verteilt (Hero, Love Story, Countdown, Galerie).`
            }
          </C.AlertBox>
        )}
        
        <MultiImageUploader
          components={C}
          images={images}
          onImagesChange={handleImagesChange}
          folder={`${baseFolder}/gallery`}
          maxImages={20}
          showCaptions={showCaptions}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('gallery')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GalleryEditor;
