// core/editors/DirectionsEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';

function DirectionsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.directions || {};
  const update = (field, value) => updateContent('directions', { ...content, [field]: value });

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
          <C.Label>Adresse *</C.Label>
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
        
        <C.SectionLabel>Anreiseoptionen</C.SectionLabel>
        
        <C.FormGroup>
          <C.Label>🚗 Parkplätze</C.Label>
          <C.TextArea 
            value={content.parking_info || ''} 
            onChange={(e) => update('parking_info', e.target.value)} 
            placeholder="Kostenlose Parkplätze direkt am Veranstaltungsort vorhanden."
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>🚇 Öffentliche Verkehrsmittel</C.Label>
          <C.TextArea 
            value={content.public_transport || ''} 
            onChange={(e) => update('public_transport', e.target.value)} 
            placeholder="U-Bahn Linie U3, Haltestelle Musterstraße (5 Min. Fußweg)"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>🚕 Taxi / Shuttle</C.Label>
          <C.TextArea 
            value={content.taxi_info || ''} 
            onChange={(e) => update('taxi_info', e.target.value)} 
            placeholder="Taxi-Ruf Hamburg: 040 12345"
          />
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('directions')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default DirectionsEditor;
