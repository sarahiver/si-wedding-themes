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
            type="date"
            value={content.target_date ? content.target_date.split('T')[0] : ''}
            onChange={(e) => update('target_date', e.target.value)}
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={content.show_seconds || false}
              onChange={(e) => update('show_seconds', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Sekunden anzeigen</span>
          </label>
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
