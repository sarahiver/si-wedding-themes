// core/editors/GuestbookEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';

function GuestbookEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.guestbook || {};
  const update = (field, value) => updateContent('guestbook', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Gästebuch bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Gästebuch"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Hinterlasst uns eine Nachricht..."
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Checkbox
            checked={content.allow_images || false}
            onChange={(e) => update('allow_images', e.target.checked)}
          />
          <C.CheckboxLabel>Bilder in Einträgen erlauben</C.CheckboxLabel>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('guestbook')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GuestbookEditor;
