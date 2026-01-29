// core/editors/WitnessesEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function WitnessesEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.witnesses || {};
  const update = (field, value) => updateContent('witnesses', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/witnesses`}
        ratio="1/1"
        maxHeight="80px"
        label="Foto"
      />
      <C.FormGroup>
        <C.Label>Name *</C.Label>
        <C.Input 
          value={item.name || ''} 
          onChange={(e) => onChange('name', e.target.value)} 
          placeholder="Max Mustermann"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Rolle *</C.Label>
        <C.Input 
          value={item.role || ''} 
          onChange={(e) => onChange('role', e.target.value)} 
          placeholder="Trauzeuge / Trauzeugin"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Telefon</C.Label>
        <C.Input 
          value={item.phone || ''} 
          onChange={(e) => onChange('phone', e.target.value)} 
          placeholder="+49 123 456789"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>E-Mail</C.Label>
        <C.Input 
          value={item.email || ''} 
          onChange={(e) => onChange('email', e.target.value)} 
          placeholder="max@beispiel.de"
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Trauzeugen bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)} 
            placeholder="Eure Ansprechpartner"
          />
        </C.FormGroup>
        
        <C.SectionLabel>Personen</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.persons || []} 
          onItemsChange={(persons) => update('persons', persons)} 
          renderItem={renderItem} 
          createNewItem={() => ({ name: '', role: '', image: '', phone: '', email: '' })} 
          addLabel="+ Person hinzufügen" 
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('witnesses')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default WitnessesEditor;
