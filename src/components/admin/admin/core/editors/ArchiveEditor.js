// core/editors/ArchiveEditor.js - Editor für Archiv-Seite
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function ArchiveEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.archive || {};
  const update = (field, value) => updateContent('archive', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Archiv-Seite bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.AlertBox $type="info">
          Diese Seite wird angezeigt, wenn der Status auf "Archiv" steht (nach der Hochzeit).
        </C.AlertBox>
        
        <ImageUploader
          components={C}
          image={content.hero_image}
          onUpload={(url) => update('hero_image', url)}
          folder={`${baseFolder}/archive`}
          label="Hero-Bild"
          ratio="16/9"
          maxHeight="150px"
        />
        
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
        
        <C.SectionLabel>Angezeigte Bereiche</C.SectionLabel>
        
        <C.FormGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <C.Checkbox
              checked={content.gallery_active !== false}
              onChange={(e) => update('gallery_active', e.target.checked)}
            />
            <C.CheckboxLabel>Galerie anzeigen</C.CheckboxLabel>
          </div>
        </C.FormGroup>
        
        <C.FormGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <C.Checkbox
              checked={content.guestbook_active !== false}
              onChange={(e) => update('guestbook_active', e.target.checked)}
            />
            <C.CheckboxLabel>Gästebuch anzeigen</C.CheckboxLabel>
          </div>
        </C.FormGroup>
        
        <C.FormGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <C.Checkbox
              checked={content.photoupload_active !== false}
              onChange={(e) => update('photoupload_active', e.target.checked)}
            />
            <C.CheckboxLabel>Gäste-Fotos anzeigen</C.CheckboxLabel>
          </div>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('archive')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default ArchiveEditor;
