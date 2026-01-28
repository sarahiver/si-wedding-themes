// core/editors/ContactEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';

function ContactEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.contact || {};
  const update = (field, value) => updateContent('contact', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Kontakt bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Kontakt"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>E-Mail</C.Label>
          <C.Input 
            type="email"
            value={content.couple_email || ''} 
            onChange={(e) => update('couple_email', e.target.value)}
            placeholder="wir@beispiel.de"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Telefon</C.Label>
          <C.Input 
            value={content.couple_phone || ''} 
            onChange={(e) => update('couple_phone', e.target.value)}
            placeholder="+49 123 456789"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Checkbox
            checked={content.show_form || false}
            onChange={(e) => update('show_form', e.target.checked)}
          />
          <C.CheckboxLabel>Kontaktformular anzeigen</C.CheckboxLabel>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('contact')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default ContactEditor;
