// core/editors/LocationsEditor.js - Mit Google Maps, Icon-Picker & PDF Export
import React, { useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';
import AddressSearch from './AddressSearch';
import IconPicker from './IconPicker';
import { generateEmbedUrl, generateMapsUrl, isGoogleMapsAvailable } from '../../../../lib/googleMaps';
import { downloadLocationsPDF } from '../../../../lib/locationsPdf';

// ============================================
// EXPORT BAR (nur PDF)
// ============================================

function ExportBar({ locations, coupleNames }) {
  const validLocs = locations.filter((l) => l.name && (l.address || (l.lat && l.lng)));
  if (!validLocs.length) return null;

  const handlePDF = () => {
    downloadLocationsPDF(validLocs, coupleNames);
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem 0',
      marginTop: '0.5rem', borderTop: '1px solid var(--admin-border-subtle, rgba(255,255,255,0.06))',
    }}>
      <div style={{
        fontSize: '0.65rem', color: 'var(--admin-text-subtle, rgba(255,255,255,0.35))', textTransform: 'uppercase',
        letterSpacing: '0.1em', width: '100%', marginBottom: '0.25rem',
      }}>
        Exportieren ({validLocs.length} Location{validLocs.length !== 1 ? 's' : ''})
      </div>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
          color: 'var(--admin-text-secondary, rgba(255,255,255,0.7))', background: 'var(--admin-bg-subtle, rgba(255,255,255,0.04))',
          border: '1px solid var(--admin-border, rgba(255,255,255,0.1))', borderRadius: '4px',
          cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase',
        }}
        onClick={handlePDF}
        title="Druckbare Übersicht als PDF"
      >
        📄 PDF / Drucken
      </button>
    </div>
  );
}

// ============================================
// LOCATIONS EDITOR
// ============================================

function LocationsEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder, coupleNames } = useAdmin();
  const content = contentStates.locations || {};
  const update = (field, value) => updateContentField('locations', field, value);

  const renderItem = (item, index, onChange) => {
    const hasCoords = item.lat && item.lng;
    const embedUrl = hasCoords
      ? generateEmbedUrl({ lat: item.lat, lng: item.lng })
      : item.address
        ? generateEmbedUrl({ address: item.address })
        : '';

    return (
      <>
        <ImageUploader
          components={C}
          image={item.image}
          onUpload={(url) => onChange('image', url)}
          folder={`${baseFolder}/locations`}
          ratio="16/9"
          maxHeight="100px"
          label="Hauptbild"
        />
        <ImageUploader
          components={C}
          image={item.accent_image}
          onUpload={(url) => onChange('accent_image', url)}
          folder={`${baseFolder}/locations`}
          ratio="1/1"
          maxHeight="80px"
          label="Akzent-Bild (optional, überlappt Hauptbild)"
        />

        {/* Label + Name + Icon */}
        <C.FormGroup>
          <C.Label>Label (z.B. "Trauung", "Feier")</C.Label>
          <C.Input
            value={item.label || ''}
            onChange={(e) => onChange('label', e.target.value)}
            placeholder="Trauung"
          />
        </C.FormGroup>
        <C.FormRow>
          <C.FormGroup style={{ flex: 1 }}>
            <C.Label>Name *</C.Label>
            <C.Input
              value={item.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Standesamt / Kirche / Location"
            />
          </C.FormGroup>
          <C.FormGroup style={{ width: '100px', flexShrink: 0 }}>
            <C.Label>Icon</C.Label>
            <IconPicker
              value={item.icon || ''}
              onChange={(val) => onChange('icon', val)}
              components={C}
            />
          </C.FormGroup>
        </C.FormRow>

        {/* Typ + Uhrzeit */}
        <C.FormRow>
          <C.FormGroup style={{ flex: 1 }}>
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
          <C.FormGroup style={{ flex: 1 }}>
            <C.Label>Uhrzeit</C.Label>
            <C.Input
              value={item.time || ''}
              onChange={(e) => onChange('time', e.target.value)}
              placeholder="14:00 Uhr"
            />
          </C.FormGroup>
        </C.FormRow>

        {/* Adress-Suche */}
        <C.FormGroup>
          <AddressSearch
            components={C}
            address={item.address || ''}
            onSelect={({ address, lat, lng }) => {
              onChange({
                address,
                lat,
                lng,
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
            style={{ minHeight: '60px' }}
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
              borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--admin-border, rgba(255,255,255,0.1))',
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
            {!item.maps_url && item.address
              ? 'Wird automatisch aus der Adresse generiert'
              : 'Eigenen Link eingeben oder Adresse über Suche setzen'
            }
          </C.HelpText>
        </C.FormGroup>
      </>
    );
  };

  const locations = content.locations || [];

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
            💡 <strong>Tipp:</strong> Google Maps API-Key in Vercel hinterlegen für Karten-Previews & Koordinaten.
          </div>
        )}

        <C.SectionLabel>Orte (max. 4)</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Adressen über die Suche eingeben – Koordinaten und Maps-Links werden automatisch gesetzt.
        </C.HelpText>
        <ListEditor
          components={C}
          items={locations}
          onItemsChange={(locs) => update('locations', locs)}
          renderItem={renderItem}
          createNewItem={() => ({
            name: '', label: '', type: '', address: '', time: '', description: '',
            image: '', accent_image: '', maps_url: '', icon: '📍', lat: null, lng: null,
          })}
          addLabel="+ Location"
          maxItems={4}
        />

        {/* Export */}
        <ExportBar locations={locations} coupleNames={coupleNames || 'Brautpaar'} />

        <C.Divider />
        <C.Button onClick={() => saveContent('locations')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default LocationsEditor;
