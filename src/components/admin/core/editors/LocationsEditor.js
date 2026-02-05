// core/editors/LocationsEditor.js - Mit Google Maps Integration
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';
import AddressSearch from './AddressSearch';
import { generateEmbedUrl, generateMapsUrl, isGoogleMapsAvailable } from '../../lib/googleMaps';

function LocationsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.locations || {};
  const update = (field, value) => updateContent('locations', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => {
    const hasCoords = item.lat && item.lng;
    const embedUrl = hasCoords
      ? generateEmbedUrl({ lat: item.lat, lng: item.lng })
      : item.address
        ? generateEmbedUrl({ address: item.address })
        : '';
    const autoMapsUrl = item.address ? generateMapsUrl(item.address) : '';

    return (
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

        {/* Adress-Suche */}
        <C.FormGroup>
          <AddressSearch
            components={C}
            address={item.address || ''}
            onSelect={({ address, lat, lng }) => {
              // Batch-Update: Adresse + Koordinaten + auto Maps-URL
              onChange({
                address: address,
                lat: lat,
                lng: lng,
                maps_url: generateMapsUrl(address),
              });
            }}
            label="Adresse suchen"
            placeholder="z.B. Schlossstraße 1, Heidelberg"
          />
          <C.TextArea
            value={item.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder={"Musterstraße 1\n20095 Hamburg"}
          />
          {hasCoords && (
            <C.HelpText style={{ color: '#10B981' }}>
              ✓ Koordinaten: {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
            </C.HelpText>
          )}
          {!hasCoords && item.address && (
            <C.HelpText style={{ color: '#F59E0B' }}>
              ⚠ Keine Koordinaten – Adresse über Suche eingeben für exakte Kartenposition
            </C.HelpText>
          )}
        </C.FormGroup>

        {/* Karten-Preview */}
        {isGoogleMapsAvailable() && embedUrl && (
          <C.FormGroup>
            <C.Label>Kartenvorschau</C.Label>
            <div style={{
              position: 'relative', paddingTop: '45%', background: '#111',
              borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <iframe
                src={embedUrl}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Karte: ${item.name || 'Location'}`}
              />
            </div>
          </C.FormGroup>
        )}

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
          <C.HelpText>
            {autoMapsUrl && !item.maps_url
              ? 'Wird automatisch aus der Adresse generiert'
              : 'Eigenen Link eingeben oder Adresse über Suche setzen'
            }
          </C.HelpText>
        </C.FormGroup>
      </>
    );
  };

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

        {!isGoogleMapsAvailable() && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '4px',
            background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
            fontSize: '0.8rem', color: '#F59E0B', lineHeight: 1.5,
          }}>
            💡 <strong>Tipp:</strong> Google Maps API-Key in Vercel hinterlegen für automatische Karten-Previews und Koordinaten.
            Adresssuche funktioniert trotzdem (via OpenStreetMap).
          </div>
        )}

        <C.SectionLabel>Orte (max. 4)</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Adressen über die Suche eingeben – Koordinaten und Maps-Links werden automatisch gesetzt.
        </C.HelpText>
        <ListEditor
          components={C}
          items={content.locations || []}
          onItemsChange={(locations) => update('locations', locations)}
          renderItem={renderItem}
          createNewItem={() => ({
            name: '', type: '', address: '', time: '', description: '',
            image: '', maps_url: '', lat: null, lng: null,
          })}
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
