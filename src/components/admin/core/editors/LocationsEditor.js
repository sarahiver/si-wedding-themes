// core/editors/LocationsEditor.js - Mit Google Maps, Icon-Picker & Export
import React, { useState, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';
import AddressSearch from './AddressSearch';
import IconPicker from './IconPicker';
import { generateEmbedUrl, generateMapsUrl, isGoogleMapsAvailable } from '../../../../lib/googleMaps';

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Öffnet Google Maps Route mit allen Locations als Stops
 */
function buildGoogleMapsListUrl(locations) {
  if (!locations.length) return '';
  let url = 'https://www.google.com/maps/dir/';
  locations.forEach((loc) => {
    const addr = loc.lat && loc.lng
      ? `${loc.lat},${loc.lng}`
      : encodeURIComponent(loc.address || loc.name);
    url += addr + '/';
  });
  return url;
}

/**
 * Generiert KML-Datei für Import in Google My Maps / Google Earth
 */
function generateKML(locations, coupleNames) {
  const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const typeLabels = { ceremony: 'Trauung', reception: 'Empfang', party: 'Feier' };

  const marks = locations
    .filter((l) => l.name && (l.address || (l.lat && l.lng)))
    .map((l) => {
      const desc = [typeLabels[l.type] || l.type, l.time, l.address, l.description].filter(Boolean).join('\n');
      const coords = l.lat && l.lng ? `${l.lng},${l.lat},0` : '0,0,0';
      return `    <Placemark>
      <name>${esc(l.icon ? l.icon + ' ' + l.name : l.name)}</name>
      <description>${esc(desc)}</description>
      <Point><coordinates>${coords}</coordinates></Point>
    </Placemark>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Hochzeit ${esc(coupleNames)}</name>
    <description>Locations der Hochzeit</description>
${marks}
  </Document>
</kml>`;
}

/**
 * Generiert druckbare HTML-Übersicht der Locations
 */
function generateLocationsPDF(locations, coupleNames) {
  const typeLabels = { ceremony: 'Trauung', reception: 'Empfang', party: 'Feier' };

  const rows = locations
    .filter((l) => l.name)
    .map((l) => {
      const type = typeLabels[l.type] || l.type || '';
      const link = l.maps_url || (l.address ? generateMapsUrl(l.address) : '');
      return `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:1.4em;text-align:center;width:50px">${l.icon || '📍'}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb">
          <strong>${l.name}</strong><br>
          <span style="color:#6b7280;font-size:0.85em">${type}${l.time ? ' · ' + l.time : ''}</span>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:0.9em">
          ${l.address || '—'}
          ${link ? '<br><a href="' + link + '" style="color:#2563eb;font-size:0.85em">→ Google Maps</a>' : ''}
        </td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Locations – ${coupleNames}</title>
<style>@media print{body{margin:0}}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:40px;color:#111;max-width:800px;margin:0 auto}
h1{font-size:1.5em;font-weight:600;margin-bottom:.25em}p.sub{color:#6b7280;font-size:.9em;margin-bottom:2em}
table{width:100%;border-collapse:collapse}.foot{margin-top:3em;padding-top:1em;border-top:1px solid #e5e7eb;font-size:.75em;color:#9ca3af;text-align:center}</style>
</head><body><h1>📍 Locations</h1><p class="sub">Hochzeit ${coupleNames}</p><table>${rows}</table>
<div class="foot">siwedding.de</div></body></html>`;
}

// ============================================
// EXPORT BAR
// ============================================

function ExportBar({ locations, coupleNames }) {
  const [active, setActive] = useState('');

  const validLocs = locations.filter((l) => l.name && (l.address || (l.lat && l.lng)));
  if (!validLocs.length) return null;

  const go = (key, fn) => {
    setActive(key);
    fn();
    setTimeout(() => setActive(''), 800);
  };

  const handleMaps = () => go('maps', () => {
    const url = buildGoogleMapsListUrl(validLocs);
    if (url) window.open(url, '_blank');
  });

  const handleKML = () => go('kml', () => {
    const kml = generateKML(validLocs, coupleNames);
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hochzeit_${(coupleNames || '').replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_')}_Locations.kml`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const handlePDF = () => go('pdf', () => {
    const html = generateLocationsPDF(validLocs, coupleNames);
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 300); }
  });

  const btn = (key) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
    color: active === key ? '#10B981' : 'rgba(255,255,255,0.7)',
    background: active === key ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active === key ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase',
  });

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem 0',
      marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        letterSpacing: '0.1em', width: '100%', marginBottom: '0.25rem',
      }}>
        Exportieren ({validLocs.length} Location{validLocs.length !== 1 ? 's' : ''})
      </div>
      <button style={btn('maps')} onClick={handleMaps} title="Alle Locations in Google Maps öffnen (Route)">
        🗺️ Google Maps
      </button>
      <button style={btn('kml')} onClick={handleKML} title="KML herunterladen – Import in Google My Maps / Earth">
        📥 KML
      </button>
      <button style={btn('pdf')} onClick={handlePDF} title="Druckbare Übersicht als PDF">
        🖨️ PDF / Drucken
      </button>
    </div>
  );
}

// ============================================
// LOCATIONS EDITOR
// ============================================

function LocationsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder, coupleNames } = useAdmin();
  const content = contentStates.locations || {};
  const update = (field, value) => updateContent('locations', { ...content, [field]: value });

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
          label="Bild (optional)"
        />

        {/* Name + Icon */}
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
            name: '', type: '', address: '', time: '', description: '',
            image: '', maps_url: '', icon: '📍', lat: null, lng: null,
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
