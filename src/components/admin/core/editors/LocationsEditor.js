// core/editors/LocationsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function LocationsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.locations;
  const update = (field, value) => updateContent('locations', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.type || ''} onChange={(e) => onChange('type', e.target.value)} placeholder="Typ (z.B. Trauung)" />
        <C.Input value={item.name || ''} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" />
      </C.GridRow>
      <C.FormGroup><C.Input value={item.address || ''} onChange={(e) => onChange('address', e.target.value)} placeholder="Adresse" /></C.FormGroup>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.time || ''} onChange={(e) => onChange('time', e.target.value)} placeholder="Uhrzeit" />
        <C.Input value={item.maps_url || ''} onChange={(e) => onChange('maps_url', e.target.value)} placeholder="Google Maps URL" />
      </C.GridRow>
      <ImageUploader components={C} image={item.image} onUpload={(url) => onChange('image', url)} folder={`${baseFolder}/locations`} ratio="16/9" label="Bild" />
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Locations bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Orte</C.SectionLabel>
        <ListEditor components={C} items={content.locations || []} onItemsChange={(locations) => update('locations', locations)} renderItem={renderItem} createNewItem={() => ({ type: '', name: '', address: '', time: '', maps_url: '', image: null })} addLabel="+ Location" />
        <C.Divider />
        <C.Button onClick={() => saveContent('locations')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default LocationsEditor;
