// core/editors/LocationsEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function LocationsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.locations || {};
  const update = (field, value) => updateContent('locations', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/locations`}
        ratio="16/9"
        maxHeight="100px"
        label="Bild (optional)"
      />
      <C.FormGroup>
        <C.Label>Name *</C.Label>
        <C.Input
          value={item.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Standesamt / Kirche / Location"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Typ</C.Label>
        <C.Select
          value={item.type || ''}
          onChange={(e) => onChange('type', e.target.value)}
        >
          <option value="">-- Auswählen --</option>
          <option value="ceremony">Trauung</option>
          <option value="reception">Empfang</option>
          <option value="party">Feier</option>
        </C.Select>
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Adresse *</C.Label>
        <C.TextArea
          value={item.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Musterstraße 1&#10;20095 Hamburg"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Uhrzeit</C.Label>
        <C.Input
          value={item.time || ''}
          onChange={(e) => onChange('time', e.target.value)}
          placeholder="14:00 Uhr"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Beschreibung</C.Label>
        <C.TextArea
          value={item.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Infos zur Location..."
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Google Maps Link</C.Label>
        <C.Input
          value={item.maps_url || ''}
          onChange={(e) => onChange('maps_url', e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Locations bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input
            value={content.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Locations"
          />
        </C.FormGroup>

        <C.SectionLabel>Orte (max. 4)</C.SectionLabel>
        <ListEditor
          components={C}
          items={content.locations || []}
          onItemsChange={(locations) => update('locations', locations)}
          renderItem={renderItem}
          createNewItem={() => ({ name: '', type: '', address: '', time: '', description: '', image: '', maps_url: '' })}
          addLabel="+ Location"
          maxItems={4}
        />

        <C.Divider />
        <C.Button onClick={() => saveContent('locations')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default LocationsEditor;
