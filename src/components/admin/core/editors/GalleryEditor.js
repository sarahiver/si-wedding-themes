// core/editors/GalleryEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import MultiImageUploader from './MultiImageUploader';

function GalleryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gallery || {};
  const update = (field, value) => updateContent('gallery', { ...content, [field]: value });

  // Convert images array to include captions
  const handleImagesChange = (urls) => {
    // Preserve existing captions when possible
    const existingImages = content.images || [];
    const newImages = urls.map((url, i) => {
      const existing = existingImages.find(img => img.url === url || img === url);
      return {
        url: typeof url === 'string' ? url : url.url,
        caption: existing?.caption || ''
      };
    });
    update('images', newImages);
  };

  const updateCaption = (index, caption) => {
    const images = [...(content.images || [])];
    if (images[index]) {
      images[index] = { ...images[index], caption };
      update('images', images);
    }
  };

  // Get URLs for MultiImageUploader
  const imageUrls = (content.images || []).map(img => typeof img === 'string' ? img : img.url);

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
        
        {(content.images || []).length > 0 && (
          <>
            <C.SectionLabel>Bildunterschriften</C.SectionLabel>
            {(content.images || []).map((img, i) => (
              <C.FormGroup key={i}>
                <C.Label>Bild {i + 1}</C.Label>
                <C.Input 
                  value={img.caption || ''} 
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Bildunterschrift..."
                />
              </C.FormGroup>
            ))}
          </>
        )}
        
        <C.Divider />
        <C.Button onClick={() => saveContent('gallery')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GalleryEditor;
