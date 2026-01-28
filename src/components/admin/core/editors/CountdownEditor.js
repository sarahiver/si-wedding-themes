// core/editors/CountdownEditor.js
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

function CountdownEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.countdown;
  const [error, setError] = useState('');
  
  const update = (field, value) => {
    updateContent('countdown', { ...content, [field]: value });
    setError('');
  };

  const handleSave = () => {
    if (content.target_date && new Date(content.target_date) < new Date()) {
      setError('Datum darf nicht in der Vergangenheit liegen');
      return;
    }
    saveContent('countdown');
  };

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
            placeholder="z.B. Noch"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Datum & Uhrzeit</C.Label>
          <C.Input 
            type="datetime-local"
            value={content.target_date?.slice(0, 16) || ''} 
            onChange={(e) => update('target_date', e.target.value)}
            $error={!!error}
          />
          {error && <C.ErrorText>{error}</C.ErrorText>}
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Checkbox>
            <input 
              type="checkbox" 
              checked={content.show_seconds || false} 
              onChange={(e) => update('show_seconds', e.target.checked)}
            />
            Sekunden anzeigen
          </C.Checkbox>
        </C.FormGroup>
        
        <C.Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default CountdownEditor;
