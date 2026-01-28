// core/editors/DirectionsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

function DirectionsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.directions;
  const defaultOptions = [{ icon: '🚗', title: 'Auto', description: '' }, { icon: '🚃', title: 'Öffentlich', description: '' }, { icon: '✈️', title: 'Flugzeug', description: '' }];
  const options = content.options?.length ? content.options : defaultOptions;
  const update = (field, value) => updateContent('directions', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="60px 1fr">
        <C.Input value={item.icon || ''} onChange={(e) => onChange('icon', e.target.value)} style={{ textAlign: 'center' }} />
        <C.Input value={item.title || ''} onChange={(e) => onChange('title', e.target.value)} placeholder="Titel" />
      </C.GridRow>
      <C.FormGroup><C.TextArea value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Wegbeschreibung" /></C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Anfahrt bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Einleitung</C.Label><C.TextArea value={content.intro || ''} onChange={(e) => update('intro', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Anfahrtsoptionen</C.SectionLabel>
        <ListEditor components={C} items={options} onItemsChange={(opts) => update('options', opts)} renderItem={renderItem} createNewItem={() => ({ icon: '', title: '', description: '' })} addLabel="+ Option" />
        <C.FormGroup><C.Label>Parken</C.Label><C.TextArea value={content.parking || ''} onChange={(e) => update('parking', e.target.value)} /></C.FormGroup>
        <C.Divider />
        <C.Button onClick={() => saveContent('directions')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default DirectionsEditor;
