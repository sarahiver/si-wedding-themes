// core/editors/PhotoUploadEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function PhotoUploadEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.photoupload || {};
  const update = (field, value) => updateContent('photoupload', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Foto-Upload bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <ImageUploader
          components={C}
          image={content.background_image}
          onUpload={(url) => update('background_image', url)}
          folder={`${baseFolder}/photoupload`}
          ratio="21/9"
          label="Hintergrundbild"
          helpText="Vollbild hinter der Upload-Sektion"
          maxHeight="120px"
        />
        
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Teilt eure Fotos"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Ladet hier eure schönsten Momente hoch..."
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Max. Uploads pro Gast</C.Label>
          <C.Input 
            type="number"
            min="1"
            max="20"
            value={content.max_files || 10} 
            onChange={(e) => update('max_files', parseInt(e.target.value) || 10)}
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={content.moderation !== false}
              onChange={(e) => update('moderation', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Fotos müssen freigegeben werden</span>
          </label>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('photoupload')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default PhotoUploadEditor;
