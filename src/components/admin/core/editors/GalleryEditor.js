// core/editors/GalleryEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import MultiImageUploader from './MultiImageUploader';

function GalleryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gallery || {};
  const update = (field, value) => updateContent('gallery', { ...content, [field]: value });

  // Get image URLs (handle both string arrays and object arrays)
  const imageUrls = (content.images || []).map(img => typeof img === 'string' ? img : img.url);

  const handleImagesChange = (urls) => {
    // Store as simple URL strings (no captions needed per requirement)
    update('images', urls.map(url => ({ url: typeof url === 'string' ? url : url.url })));
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
          <C.Label>Layout</C.Label>
          <C.Select 
            value={content.layout || 'grid'} 
            onChange={(e) => update('layout', e.target.value)}
          >
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
            <option value="slider">Slider</option>
          </C.Select>
        </C.FormGroup>
        
        <C.SectionLabel>Bilder (max. 20)</C.SectionLabel>
        <MultiImageUploader
          components={C}
          images={imageUrls}
          onImagesChange={handleImagesChange}
          folder={`${baseFolder}/gallery`}
          maxImages={20}
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
