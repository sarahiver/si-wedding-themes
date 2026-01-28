// core/editors/TimelineEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

function TimelineEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.timeline;
  
  const update = (field, value) => {
    updateContent('timeline', { ...content, [field]: value });
  };

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="80px 60px 1fr">
        <C.Input value={item.time || ''} onChange={(e) => onChange('time', e.target.value)} placeholder="14:00" />
        <C.Input value={item.icon || ''} onChange={(e) => onChange('icon', e.target.value)} placeholder="💒" style={{ textAlign: 'center' }} />
        <C.Input value={item.title || ''} onChange={(e) => onChange('title', e.target.value)} placeholder="Titel" />
      </C.GridRow>
      <C.FormGroup>
        <C.Input value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Beschreibung" />
      </C.FormGroup>
      <C.FormGroup>
        <C.Input value={item.location || ''} onChange={(e) => onChange('location', e.target.value)} placeholder="Ort" />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Ablauf bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="Tagesablauf" />
        </C.FormGroup>
        <C.SectionLabel>Programmpunkte</C.SectionLabel>
        <ListEditor components={C} items={content.events || []} onItemsChange={(events) => update('events', events)} renderItem={renderItem} createNewItem={() => ({ time: '', icon: '', title: '', description: '', location: '' })} addLabel="+ Programmpunkt" />
        <C.Divider />
        <C.Button onClick={() => saveContent('timeline')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default TimelineEditor;
