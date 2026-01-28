// core/editors/DresscodeEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';

function DresscodeEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.dresscode;
  const update = (field, value) => updateContent('dresscode', { ...content, [field]: value });
  const colors = content.colors || [];

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Dresscode bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Stil</C.Label><C.Input value={content.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="Festlich elegant" /></C.FormGroup>
        <C.FormGroup><C.Label>Beschreibung</C.Label><C.TextArea value={content.description || ''} onChange={(e) => update('description', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Farbpalette</C.SectionLabel>
        <C.ColorPalette>
          {colors.map((c, i) => (
            <C.ColorItem key={i}>
              <C.ColorInput type="color" value={c} onChange={(e) => { const cs = [...colors]; cs[i] = e.target.value; update('colors', cs); }} />
              <C.SmallButton $variant="danger" onClick={() => update('colors', colors.filter((_, idx) => idx !== i))}>×</C.SmallButton>
            </C.ColorItem>
          ))}
          <C.SmallButton onClick={() => update('colors', [...colors, '#8B9D83'])}>+ Farbe</C.SmallButton>
        </C.ColorPalette>
        <C.Divider />
        <C.Button onClick={() => saveContent('dresscode')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default DresscodeEditor;
