// core/editors/GiftsEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function GiftsEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gifts || {};
  const update = (field, value) => updateContent('gifts', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/gifts`}
        ratio="1/1"
        maxHeight="100px"
        label="Bild"
      />
      <C.FormGroup>
        <C.Label>Titel *</C.Label>
        <C.Input 
          value={item.title || ''} 
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Hochzeitsreise"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Kosten</C.Label>
        <C.Input 
          value={item.cost || ''} 
          onChange={(e) => onChange('cost', e.target.value)}
          placeholder="500€"
        />
      </C.FormGroup>
      <C.FormGroup>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={item.reserved || false}
            onChange={(e) => onChange('reserved', e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Reserviert</span>
        </label>
      </C.FormGroup>
      {item.reserved && (
        <C.FormGroup>
          <C.Label>Reserviert von</C.Label>
          <C.Input 
            value={item.reserved_by || ''} 
            onChange={(e) => onChange('reserved_by', e.target.value)}
            placeholder="Name des Gastes"
          />
        </C.FormGroup>
      )}
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Geschenke bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Geschenke"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Das größte Geschenk ist eure Anwesenheit..."
          />
        </C.FormGroup>
        
        <C.SectionLabel>Zahlungsoptionen</C.SectionLabel>
        
        <C.FormGroup>
          <C.Label>Bankverbindung (IBAN)</C.Label>
          <C.TextArea 
            value={content.bank_details || ''} 
            onChange={(e) => update('bank_details', e.target.value)}
            placeholder="IBAN: DE89 3704 0044 0532 0130 00&#10;BIC: COBADEFFXXX&#10;Verwendungszweck: Hochzeitsgeschenk"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>PayPal.me Link</C.Label>
          <C.Input 
            value={content.paypal_link || ''} 
            onChange={(e) => update('paypal_link', e.target.value)}
            placeholder="https://paypal.me/..."
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={content.show_registry || false}
              onChange={(e) => update('show_registry', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Wunschliste zeigen</span>
          </label>
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Externe Wunschliste URL</C.Label>
          <C.Input 
            value={content.registry_url || ''} 
            onChange={(e) => update('registry_url', e.target.value)}
            placeholder="https://..."
          />
        </C.FormGroup>
        
        <C.SectionLabel>Wunschliste (max. 20)</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.items || []} 
          onItemsChange={(items) => update('items', items)} 
          renderItem={renderItem} 
          createNewItem={() => ({ title: '', image: '', cost: '', reserved: false, reserved_by: '' })} 
          addLabel="+ Wunsch"
          maxItems={20}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('gifts')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GiftsEditor;
