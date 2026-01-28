// core/editors/GiftsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function GiftsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gifts;
  const update = (field, value) => updateContent('gifts', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.name || ''} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" />
        <C.Input value={item.price || ''} onChange={(e) => onChange('price', e.target.value)} placeholder="Preis (z.B. 50€)" />
      </C.GridRow>
      <C.FormGroup><C.Input value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Beschreibung" /></C.FormGroup>
      <C.FormGroup><C.Input value={item.url || ''} onChange={(e) => onChange('url', e.target.value)} placeholder="Link (optional)" /></C.FormGroup>
      <ImageUploader components={C} image={item.image} onUpload={(url) => onChange('image', url)} folder={`${baseFolder}/gifts`} ratio="1/1" label="Bild" />
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Geschenke bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Beschreibung</C.Label><C.TextArea value={content.description || ''} onChange={(e) => update('description', e.target.value)} /></C.FormGroup>
        <C.FormGroup><C.Label>Bankverbindung</C.Label><C.TextArea value={content.payment_info || ''} onChange={(e) => update('payment_info', e.target.value)} placeholder="IBAN: DE..." /></C.FormGroup>
        <C.SectionLabel>Geschenkwünsche</C.SectionLabel>
        <ListEditor components={C} items={content.items || []} onItemsChange={(items) => update('items', items)} renderItem={renderItem} createNewItem={() => ({ name: '', description: '', price: '', url: '', image: null })} addLabel="+ Wunsch" />
        <C.Divider />
        <C.Button onClick={() => saveContent('gifts')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default GiftsEditor;
