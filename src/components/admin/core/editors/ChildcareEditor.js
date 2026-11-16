// core/editors/ChildcareEditor.js – Inhaltsblock Kinderbetreuung
import React from 'react';
import { useAdmin } from '../AdminContext';

function ChildcareEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving } = useAdmin();
  const content = contentStates.childcare || {};
  const update = (field, value) => updateContentField('childcare', field, value);

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Kinderbetreuung bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="Childcare" />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Text</C.Label>
          <C.TextArea value={content.description || ''} onChange={(e) => update('description', e.target.value)} placeholder="Our little guests will be in good hands …" />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Zierschrift im Hintergrund (optional)</C.Label>
          <C.Input value={content.watermark || ''} onChange={(e) => update('watermark', e.target.value)} placeholder="Kids" />
        </C.FormGroup>
        <C.Divider />
        <C.Button onClick={() => saveContent('childcare')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default ChildcareEditor;
