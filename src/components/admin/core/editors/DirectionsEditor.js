// core/editors/DirectionsEditor.js - Mit Google Maps Integration
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import AddressSearch from './AddressSearch';
import ImageUploader from './ImageUploader';
import { generateEmbedUrl, generateMapsUrl, isGoogleMapsAvailable } from '../../../../lib/googleMaps';

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
  const { contentStates, updateContent, updateContentField, saveContent, isSaving } = useAdmin();
  const content = contentStates.directions || {};
  const update = (field, value) => updateContentField('directions', field, value);

  // Batch-Update für mehrere Felder gleichzeitig
  const updateMultiple = (updates) => updateContent('directions', { ...content, ...updates });

  const getTransportInfo = (type) => {
    return TRANSPORT_OPTIONS.find(o => o.value === type) || TRANSPORT_OPTIONS[0];
  };

  // Auto-generate embed URL from coordinates or address
  const hasCoords = content.lat && content.lng;
  const embedUrl = hasCoords
    ? generateEmbedUrl({ lat: content.lat, lng: content.lng })
    : content.address
      ? generateEmbedUrl({ address: content.address })
      : content.maps_embed || '';

  const renderItem = (item, index, onChange) => {
    const isCustom = item.type === 'custom';

    return (
      <>
        <C.FormGroup>
          <C.Label>Transportmittel</C.Label>
          <C.Select
            value={item.type || 'car'}
            onChange={(e) => {
              const newType = e.target.value;
              const info = getTransportInfo(newType);
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
    return { type: info.value, icon: info.icon, title: info.label, description: '' };
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

        {/* Adress-Suche mit Autocomplete */}
        <C.FormGroup>
          <AddressSearch
            components={C}
            address={content.address || ''}
            onSelect={({ address, lat, lng }) => {
              updateMultiple({
                address: address,
                lat: lat,
                lng: lng,
                // Auto-Embed generieren, wenn API-Key vorhanden
                maps_embed: isGoogleMapsAvailable()
                  ? generateEmbedUrl({ lat, lng })
                  : content.maps_embed || '',
              });
            }}
            label="Adresse suchen"
            placeholder="z.B. Schlossstraße 1, Heidelberg"
          />
          <C.TextArea
            value={content.address || ''}
            onChange={(e) => update('address', e.target.value)}
            placeholder={"Musterstraße 1\n20095 Hamburg"}
          />
          {hasCoords && (
            <C.HelpText style={{ color: '#10B981' }}>
              ✓ Koordinaten: {content.lat.toFixed(5)}, {content.lng.toFixed(5)}
            </C.HelpText>
          )}
        </C.FormGroup>

        {/* Karten-Preview */}
        {embedUrl && (
          <C.FormGroup>
            <C.Label>Kartenvorschau</C.Label>
            <div style={{
              position: 'relative', paddingTop: '50%', background: '#111',
              borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <iframe
                src={embedUrl}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Anfahrtskarte Vorschau"
              />
            </div>
          </C.FormGroup>
        )}

        <C.FormGroup>
          <C.Label>Google Maps Embed URL</C.Label>
          <C.Input
            value={content.maps_embed || ''}
            onChange={(e) => update('maps_embed', e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />
          <C.HelpText>
            {isGoogleMapsAvailable()
              ? 'Wird automatisch aus der Adresse generiert – oder manuell überschreiben'
              : 'Embed-Link von Google Maps (Teilen → Karte einbetten)'
            }
          </C.HelpText>
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

        <C.SectionLabel>Bilder</C.SectionLabel>
        <ImageUploader components={C} image={content.image} onUpload={(url) => update('image', url)} label="Hauptbild" helpText="Bild rechts neben dem Text" />
        <ImageUploader components={C} image={content.accent_image} onUpload={(url) => update('accent_image', url)} label="Akzent-Bild" helpText="Kleines überlappendes Bild" />

        <C.Divider />
        <C.Button onClick={() => saveContent('directions')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default DirectionsEditor;
