// core/editors/RSVPEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';

function RSVPEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.rsvp;
  const update = (field, value) => updateContent('rsvp', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>RSVP bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Untertitel</C.Label><C.Input value={content.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Deadline</C.Label><C.Input type="date" value={content.deadline || ''} onChange={(e) => update('deadline', e.target.value)} /></C.FormGroup>
        <C.Divider />
        <C.SectionLabel>Formularfelder</C.SectionLabel>
        <C.FormGroup><C.Checkbox><input type="checkbox" checked={content.show_menu !== false} onChange={(e) => update('show_menu', e.target.checked)} />Menüauswahl anzeigen</C.Checkbox></C.FormGroup>
        <C.FormGroup><C.Checkbox><input type="checkbox" checked={content.show_allergies !== false} onChange={(e) => update('show_allergies', e.target.checked)} />Allergien-Feld anzeigen</C.Checkbox></C.FormGroup>
        <C.FormGroup><C.Checkbox><input type="checkbox" checked={content.show_message !== false} onChange={(e) => update('show_message', e.target.checked)} />Nachricht-Feld anzeigen</C.Checkbox></C.FormGroup>
        <C.Divider />
        <C.Button onClick={() => saveContent('rsvp')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default RSVPEditor;
