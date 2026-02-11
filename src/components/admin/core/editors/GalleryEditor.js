// core/editors/GalleryEditor.js - Mit Drag&Drop, Captions & Sortierung
import React from 'react';
import { useAdmin } from '../AdminContext';
import MultiImageUploader from './MultiImageUploader';

function GalleryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gallery || {};
  const update = (field, value) => updateContent('gallery', { ...content, [field]: value });

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

        <C.FormGroup>
          <C.Label>Untertitel</C.Label>
          <C.Input 
            value={content.subtitle || ''} 
            onChange={(e) => update('subtitle', e.target.value)}
            placeholder="Unsere schönsten Momente"
          />
        </C.FormGroup>
        
        <C.Divider />
        
        <C.SectionLabel>Bilder (max. 20)</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Bilder per Drag &amp; Drop hochladen. Reihenfolge durch Ziehen ändern.
        </C.HelpText>
        
        <MultiImageUploader
          components={C}
          images={images}
          onImagesChange={handleImagesChange}
          folder={`${baseFolder}/gallery`}
          maxImages={20}
          showCaptions={true}
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
