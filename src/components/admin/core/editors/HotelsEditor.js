// core/editors/HotelsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function HotelsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.accommodations;
  const update = (field, value) => updateContent('accommodations', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormGroup><C.Input value={item.name || ''} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" /></C.FormGroup>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.distance || ''} onChange={(e) => onChange('distance', e.target.value)} placeholder="Entfernung" />
        <C.Input value={item.price_range || ''} onChange={(e) => onChange('price_range', e.target.value)} placeholder="Preisbereich" />
      </C.GridRow>
      <C.FormGroup><C.TextArea value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Beschreibung" /></C.FormGroup>
      <C.FormGroup><C.Input value={item.url || ''} onChange={(e) => onChange('url', e.target.value)} placeholder="Website" /></C.FormGroup>
      <ImageUploader components={C} image={item.image} onUpload={(url) => onChange('image', url)} folder={`${baseFolder}/hotels`} ratio="16/9" label="Bild" />
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Hotels bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Beschreibung</C.Label><C.TextArea value={content.description || ''} onChange={(e) => update('description', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Hotels</C.SectionLabel>
        <ListEditor components={C} items={content.hotels || []} onItemsChange={(hotels) => update('hotels', hotels)} renderItem={renderItem} createNewItem={() => ({ name: '', distance: '', price_range: '', description: '', url: '', image: null })} addLabel="+ Hotel" />
        <C.Divider />
        <C.Button onClick={() => saveContent('accommodations')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default HotelsEditor;
