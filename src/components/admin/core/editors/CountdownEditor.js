// core/editors/CountdownEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import { useHiddenFields } from './themeFieldConfig';

function CountdownEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, project } = useAdmin();
  const { hidden } = useHiddenFields('countdown', project);
  const content = contentStates.countdown || {};
  const update = (field, value) => updateContentField('countdown', field, value);

  // Wenn kein target_date gesetzt, aber wedding_date im Projekt vorhanden → vorbelegen
  const displayDate = content.target_date || project?.wedding_date || '';

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Countdown bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {!hidden('title') && (
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Noch"
          />
        </C.FormGroup>
        )}
        
        <C.FormGroup>
          <C.Label>Zieldatum *</C.Label>
          <C.Input
            type="date"
            value={displayDate ? displayDate.split('T')[0] : ''}
            onChange={(e) => update('target_date', e.target.value)}
          />
          {!content.target_date && project?.wedding_date && (
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted, rgba(255,255,255,0.4))', marginTop: '0.25rem', display: 'block' }}>
              Übernommen vom Hochzeitsdatum. Wird beim Speichern gesetzt.
            </span>
          )}
        </C.FormGroup>

        {/* Optional: Ist eine Uhrzeit gesetzt, zählt der Countdown auf diese
            Uhrzeit herunter. Ohne Uhrzeit auf den Beginn des Tages. */}
        <C.FormGroup>
          <C.Label>Uhrzeit (optional)</C.Label>
          <C.Input
            type="time"
            value={content.target_time || ''}
            onChange={(e) => update('target_time', e.target.value)}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted, rgba(255,255,255,0.4))', marginTop: '0.25rem', display: 'block' }}>
            {content.target_time
              ? `Countdown läuft auf ${content.target_time} Uhr.`
              : 'Ohne Uhrzeit zählt der Countdown auf den Tag.'}
          </span>
        </C.FormGroup>
        
        {!hidden('show_seconds') && (
        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={content.show_seconds || false}
              onChange={(e) => update('show_seconds', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'var(--admin-text-secondary, rgba(255,255,255,0.7))' }}>Sekunden anzeigen</span>
          </label>
        </C.FormGroup>
        )}
        
        <C.Divider />
        <C.Button onClick={() => {
          // Wenn kein target_date gesetzt, aber displayDate vorhanden → übernehmen
          if (!content.target_date && displayDate) {
            updateContentField('countdown', 'target_date', displayDate.split('T')[0]);
          }
          saveContent('countdown');
        }} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default CountdownEditor;
