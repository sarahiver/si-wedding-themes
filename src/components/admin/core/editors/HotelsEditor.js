// core/editors/HotelsEditor.js - Schema-konform (Accommodations)
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function HotelsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.accommodations || {};
  const update = (field, value) => updateContent('accommodations', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/hotels`}
        ratio="16/9"
        maxHeight="80px"
        label="Bild"
        maxHeight="80px"
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
        <C.Label>Adresse</C.Label>
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
        <C.Label>Buchungslink</C.Label>
        <C.Input 
          value={item.url || ''} 
          onChange={(e) => onChange('url', e.target.value)}
          placeholder="https://..."
        />
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
        
        <C.SectionLabel>Hotels (max. 4)</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.hotels || []} 
          onItemsChange={(hotels) => update('hotels', hotels)} 
          renderItem={renderItem} 
          createNewItem={() => ({ name: '', address: '', distance: '', price_range: '', booking_code: '', url: '', image: '' })} 
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
