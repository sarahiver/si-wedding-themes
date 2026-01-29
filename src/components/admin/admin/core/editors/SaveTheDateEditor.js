// core/editors/SaveTheDateEditor.js - Editor für Save the Date Seite
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function SaveTheDateEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.savethedate || {};
  const update = (field, value) => updateContent('savethedate', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Save the Date bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.AlertBox $type="info">
          Diese Seite wird angezeigt, wenn der Status auf "Save the Date" steht.
        </C.AlertBox>
        
        <ImageUploader
          components={C}
          image={content.hero_image}
          onUpload={(url) => update('hero_image', url)}
          folder={`${baseFolder}/savethedate`}
          label="Hero-Bild"
          ratio="16/9"
          maxHeight="150px"
        />
        
        <C.FormGroup>
          <C.Label>Tagline</C.Label>
          <C.Input 
            value={content.tagline || ''} 
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="Save the Date!"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Nachricht</C.Label>
          <C.TextArea 
            value={content.message || ''} 
            onChange={(e) => update('message', e.target.value)}
            placeholder="Wir heiraten! Die Einladung folgt in Kürze..."
            style={{ minHeight: '100px' }}
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <C.Checkbox
              checked={content.countdown_active !== false}
              onChange={(e) => update('countdown_active', e.target.checked)}
            />
            <C.CheckboxLabel>Countdown anzeigen</C.CheckboxLabel>
          </div>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('savethedate')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default SaveTheDateEditor;
