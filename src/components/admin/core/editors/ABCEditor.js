// core/editors/ABCEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

function ABCEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.weddingabc;
  const update = (field, value) => updateContent('weddingabc', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="60px 1fr">
        <C.Input value={item.letter || ''} onChange={(e) => onChange('letter', e.target.value.toUpperCase())} maxLength={1} style={{ textAlign: 'center', fontWeight: 'bold' }} placeholder="A" />
        <C.Input value={item.title || ''} onChange={(e) => onChange('title', e.target.value)} placeholder="Titel" />
      </C.GridRow>
      <C.FormGroup><C.TextArea value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Beschreibung" /></C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Hochzeits-ABC bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Einträge</C.SectionLabel>
        <ListEditor components={C} items={content.entries || []} onItemsChange={(entries) => update('entries', entries)} renderItem={renderItem} createNewItem={() => ({ letter: '', title: '', description: '' })} addLabel="+ Eintrag" />
        <C.Divider />
        <C.Button onClick={() => saveContent('weddingabc')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default ABCEditor;
