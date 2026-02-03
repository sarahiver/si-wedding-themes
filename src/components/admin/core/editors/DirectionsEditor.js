// core/editors/DirectionsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

// Transportmittel-Optionen mit Icon und Label
const TRANSPORT_OPTIONS = [
  { value: 'car', icon: '🚗', label: 'Auto' },
  { value: 'parking', icon: '🅿️', label: 'Parkplätze' },
  { value: 'train', icon: '🚆', label: 'Bahn / Zug' },
  { value: 'public', icon: '🚇', label: 'Öffentliche Verkehrsmittel' },
  { value: 'bus', icon: '🚌', label: 'Bus' },
  { value: 'taxi', icon: '🚕', label: 'Taxi / Shuttle' },
  { value: 'plane', icon: '✈️', label: 'Flugzeug' },
  { value: 'bike', icon: '🚲', label: 'Fahrrad' },
  { value: 'walk', icon: '🚶', label: 'Zu Fuß' },
  { value: 'boat', icon: '⛵', label: 'Boot / Fähre' },
  { value: 'custom', icon: '📍', label: 'Eigenes' },
];

function DirectionsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.directions || {};
  const update = (field, value) => updateContent('directions', { ...content, [field]: value });

  // Get icon and label for a transport type
  const getTransportInfo = (type) => {
    const option = TRANSPORT_OPTIONS.find(o => o.value === type);
    return option || TRANSPORT_OPTIONS[0];
  };

  const renderItem = (item, index, onChange) => {
    const isCustom = item.type === 'custom';
    const transportInfo = getTransportInfo(item.type);

    return (
      <>
        <C.FormGroup>
          <C.Label>Transportmittel</C.Label>
          <C.Select
            value={item.type || 'car'}
            onChange={(e) => {
              const newType = e.target.value;
              const info = getTransportInfo(newType);
              // Batch update all fields at once
              if (newType !== 'custom') {
                onChange({ type: newType, icon: info.icon, title: info.label });
              } else {
                onChange({ type: newType });
              }
            }}
          >
            {TRANSPORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </C.Select>
        </C.FormGroup>

        {isCustom && (
          <>
            <C.FormGroup>
              <C.Label>Icon (Emoji)</C.Label>
              <C.Input
                value={item.icon || ''}
                onChange={(e) => onChange('icon', e.target.value)}
                placeholder="🚗"
                style={{ width: '80px' }}
              />
            </C.FormGroup>
            <C.FormGroup>
              <C.Label>Titel</C.Label>
              <C.Input
                value={item.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Transportmittel"
              />
            </C.FormGroup>
          </>
        )}

        <C.FormGroup>
          <C.Label>Beschreibung *</C.Label>
          <C.TextArea
            value={item.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Beschreibung der Anreiseoption..."
          />
        </C.FormGroup>
      </>
    );
  };

  const createNewItem = () => {
    const info = TRANSPORT_OPTIONS[0];
    return {
      type: info.value,
      icon: info.icon,
      title: info.label,
      description: ''
    };
  };

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Anfahrt bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input
            value={content.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Anfahrt"
          />
        </C.FormGroup>

        <C.FormGroup>
          <C.Label>Adresse</C.Label>
          <C.TextArea
            value={content.address || ''}
            onChange={(e) => update('address', e.target.value)}
            placeholder="Musterstraße 1&#10;20095 Hamburg"
          />
        </C.FormGroup>

        <C.FormGroup>
          <C.Label>Google Maps Embed URL</C.Label>
          <C.Input
            value={content.maps_embed || ''}
            onChange={(e) => update('maps_embed', e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />
          <C.HelpText>Embed-Link von Google Maps (Teilen → Karte einbetten)</C.HelpText>
        </C.FormGroup>

        <C.FormGroup>
          <C.Label>Hinweis (optional)</C.Label>
          <C.TextArea
            value={content.note || ''}
            onChange={(e) => update('note', e.target.value)}
            placeholder="Zusätzliche Hinweise zur Anfahrt..."
          />
        </C.FormGroup>

        <C.SectionLabel>Anreiseoptionen</C.SectionLabel>
        <ListEditor
          components={C}
          items={content.items || []}
          onItemsChange={(items) => update('items', items)}
          renderItem={renderItem}
          createNewItem={createNewItem}
          addLabel="+ Anreiseoption"
          maxItems={6}
        />

        <C.Divider />
        <C.Button onClick={() => saveContent('directions')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default DirectionsEditor;
