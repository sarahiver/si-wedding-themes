// core/editors/GalleryEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import MultiImageUploader from './MultiImageUploader';

function GalleryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gallery;
  const update = (field, value) => updateContent('gallery', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Galerie bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <MultiImageUploader components={C} images={content.images || []} onAdd={(img) => update('images', [...(content.images || []), img])} onRemove={(idx) => update('images', content.images.filter((_, i) => i !== idx))} folder={`${baseFolder}/gallery`} max={30} label="Bilder" />
        <C.Button onClick={() => saveContent('gallery')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default GalleryEditor;
