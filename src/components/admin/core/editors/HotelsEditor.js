// core/editors/HotelsEditor.js - Mit Google Maps Link + Buchungslink
import React from 'react';
import { useAdmin } from '../AdminContext';
import { useHiddenFields } from './themeFieldConfig';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';
import AddressSearch from './AddressSearch';
import { generateMapsUrl, isGoogleMapsAvailable } from '../../../../lib/googleMaps';

function HotelsEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder , project} = useAdmin();
  const { hidden } = useHiddenFields('accommodations', project);
  const content = contentStates.accommodations || {};
  const isClassic = project?.theme === 'classic';
  const update = (field, value) => updateContentField('accommodations', field, value);

  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/hotels`}
        ratio="16/9"
        maxHeight="100px"
        label="Bild"
      />
      <C.FormGroup>
        <C.Label>Hotel-Name *</C.Label>
        <C.Input 
          value={item.name || ''} 
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Hotel Vier Jahreszeiten"
        />
      </C.FormGroup>
      <C.FormGroup>
        <AddressSearch
          components={C}
          address={item.address || ''}
          onSelect={({ address, lat, lng }) => {
            onChange({
              address: address,
              lat: lat,
              lng: lng,
              maps_url: generateMapsUrl(address),
            });
          }}
          label="Adresse suchen"
          placeholder="z.B. Neuer Jungfernstieg 9-14, Hamburg"
        />
        <C.Input 
          value={item.address || ''} 
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Neuer Jungfernstieg 9-14, Hamburg"
        />
      </C.FormGroup>
      <C.FormRow>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Entfernung</C.Label>
          <C.Input 
            value={item.distance || ''} 
            onChange={(e) => onChange('distance', e.target.value)}
            placeholder="5 Min zur Location"
          />
        </C.FormGroup>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Preisklasse</C.Label>
          <C.Input 
            value={item.price_range || ''} 
            onChange={(e) => onChange('price_range', e.target.value)}
            placeholder="€€€"
          />
        </C.FormGroup>
      </C.FormRow>
      <C.FormGroup>
        <C.Label>Buchungscode</C.Label>
        <C.Input 
          value={item.booking_code || ''} 
          onChange={(e) => onChange('booking_code', e.target.value)}
          placeholder="HOCHZEIT2026"
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
            : item.maps_url
              ? '✓ Aus Adresssuche gesetzt – kann manuell angepasst werden'
              : 'Adresse über Suche eingeben oder Link manuell eintragen'
          }
        </C.HelpText>
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Buchungslink (optional)</C.Label>
        <C.Input 
          value={item.booking_url || item.url || ''} 
          onChange={(e) => onChange('booking_url', e.target.value)}
          placeholder="https://hotel-beispiel.de/buchen"
        />
        <C.HelpText>
          Direkter Buchungslink zum Hotel – erscheint als „Buchen" Button
        </C.HelpText>
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Übernachtung bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Übernachtung"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Allgemeine Infos</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Tipps für die Übernachtung..."
          />
        </C.FormGroup>
        
        {isClassic && (<>
          <C.SectionLabel>Hero-Bild</C.SectionLabel>
          {!hidden('hero_image') && <ImageUploader components={C} image={content.hero_image} onUpload={(url) => update('hero_image', url)} folder={`${baseFolder}/accommodations`} label="Vollbild oben" helpText="Großes Bild über der Hotels-Sektion" />}
        </>)}

        <C.SectionLabel>Hotels (max. 4)</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.hotels || []} 
          onItemsChange={(hotels) => update('hotels', hotels)} 
          renderItem={renderItem} 
          createNewItem={() => ({ name: '', address: '', distance: '', price_range: '', booking_code: '', maps_url: '', booking_url: '', url: '', image: '', lat: null, lng: null })} 
          addLabel="+ Hotel"
          maxItems={4}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('accommodations')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default HotelsEditor;
