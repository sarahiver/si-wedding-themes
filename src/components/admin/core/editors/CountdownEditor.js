// core/editors/CountdownEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';

function CountdownEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.countdown || {};
  const update = (field, value) => updateContent('countdown', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Countdown bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Noch"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Zieldatum *</C.Label>
          <C.Input 
            type="datetime-local"
            value={content.target_date || ''} 
            onChange={(e) => update('target_date', e.target.value)}
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Startdatum (optional)</C.Label>
          <C.Input 
            type="date"
            value={content.start_date || ''} 
            onChange={(e) => update('start_date', e.target.value)}
          />
          <C.HelpText>Für Zeitleisten-Countdown (Standard: Jahresanfang)</C.HelpText>
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Checkbox
            checked={content.show_seconds || false}
            onChange={(e) => update('show_seconds', e.target.checked)}
          />
          <C.CheckboxLabel>Sekunden anzeigen</C.CheckboxLabel>
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('countdown')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default CountdownEditor;
